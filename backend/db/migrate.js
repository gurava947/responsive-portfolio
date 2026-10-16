import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(resolve(currentDirectory, "schema.sql"), "utf8");

export function migrateDatabase(database) {
  const version = database.prepare("PRAGMA user_version").get().user_version;
  if (version > 3) throw new Error(`Database schema version ${version} is newer than this application supports.`);
  if (version === 3) return;
  database.exec("BEGIN IMMEDIATE");
  try {
    if (version === 1) migrateVersionOne(database);
    database.exec(schema);
    database.exec(`
      INSERT INTO theme_settings (id) VALUES (1) ON CONFLICT(id) DO NOTHING;
      INSERT INTO card_settings (id) VALUES (1) ON CONFLICT(id) DO NOTHING;
      INSERT INTO animation_settings (id) VALUES (1) ON CONFLICT(id) DO NOTHING;
      INSERT INTO preview_settings (id) VALUES (1) ON CONFLICT(id) DO NOTHING;
    `);
    migrateVersionTwo(database);
    database.exec(schema);
    database.exec("PRAGMA user_version = 3");
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function migrateVersionTwo(database) {
  const columns = new Set(database.prepare("PRAGMA table_info(card_settings)").all().map((column) => column.name));
  const addColumn = (name, definition) => {
    if (!columns.has(name)) database.exec(`ALTER TABLE card_settings ADD COLUMN ${name} ${definition}`);
  };
  addColumn("mobile_image_height", "INTEGER NOT NULL DEFAULT 150 CHECK (mobile_image_height BETWEEN 120 AND 240)");
  addColumn("tablet_image_height", "INTEGER NOT NULL DEFAULT 175 CHECK (tablet_image_height BETWEEN 140 AND 280)");
  addColumn("desktop_image_height", "INTEGER NOT NULL DEFAULT 190 CHECK (desktop_image_height BETWEEN 160 AND 320)");
}

function migrateVersionOne(database) {
  const columns = (table) => new Set(database.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name));
  const addColumn = (table, name, definition) => {
    if (!columns(table).has(name)) database.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
  };

  addColumn("projects", "category_id", "INTEGER REFERENCES categories(id) ON UPDATE CASCADE");
  database.exec(`
    INSERT INTO categories (name, display_order, active)
    SELECT DISTINCT trim(substr(category, instr(category, '·') + 1)),
      (SELECT count(*) FROM categories),
      1
    FROM projects
    WHERE instr(category, '·') > 0
    ON CONFLICT(name) DO NOTHING;
    UPDATE projects
    SET category_id = (
      SELECT id FROM categories
      WHERE name = trim(substr(projects.category, instr(projects.category, '·') + 1))
    )
    WHERE category_id IS NULL;
  `);

  addColumn("card_settings", "max_width", "INTEGER NOT NULL DEFAULT 520 CHECK (max_width BETWEEN 240 AND 520)");
  addColumn("card_settings", "min_height", "INTEGER NOT NULL DEFAULT 0 CHECK (min_height BETWEEN 0 AND 600)");
  addColumn("card_settings", "hover_highlight", "TEXT NOT NULL DEFAULT 'subtle' CHECK (hover_highlight IN ('none', 'subtle', 'medium'))");
  for (const side of ["top", "right", "bottom", "left"]) {
    addColumn(
      "card_settings",
      `border_${side}_color`,
      `TEXT NOT NULL DEFAULT '#dfe8d9' CHECK (border_${side}_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]')`
    );
  }

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS projects_category_id_required_insert
    BEFORE INSERT ON projects WHEN NEW.category_id IS NULL
    BEGIN SELECT RAISE(ABORT, 'category_id is required'); END;
    CREATE TRIGGER IF NOT EXISTS projects_category_id_required_update
    BEFORE UPDATE OF category_id ON projects WHEN NEW.category_id IS NULL
    BEGIN SELECT RAISE(ABORT, 'category_id is required'); END;
  `);
}
