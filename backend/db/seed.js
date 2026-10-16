import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const directory = dirname(fileURLToPath(import.meta.url));
const projects = JSON.parse(readFileSync(resolve(directory, "project-seed.json"), "utf8"));
const metadata = JSON.parse(readFileSync(resolve(directory, "portfolio-metadata.json"), "utf8"));

const themeDefaults = { mode: "light", primary_color: "#6d5ce8", secondary_color: "#0891b2", accent_color: "#db2777", background_color: "#f1f5fb", text_color: "#172033", muted_color: "#526176" };
const cardDefaults = {
  radius_top_left: 22, radius_top_right: 22, radius_bottom_right: 22, radius_bottom_left: 22,
  border_top: 1, border_right: 1, border_bottom: 1, border_left: 1,
  border_color: "#c8d1c1", border_top_color: "#dfe8d9", border_right_color: "#dfe8d9", border_bottom_color: "#dfe8d9", border_left_color: "#dfe8d9",
  background_color: "#ffffff", text_color: "#18231d", font_family: "arial", max_width: 520, min_height: 0,
  mobile_image_height: 160, tablet_image_height: 175, desktop_image_height: 190, font_size: 16, font_weight: 600,
  hover_scale: 1.02, hover_highlight: "medium", transition_duration: 275, transition_easing: "standard",
};
const animationDefaults = { entrance_mode: "none", scroll_reveal: 0, click_feedback: 1, preview_switch: 1, animation_intensity: "smooth", reduced_motion: 0 };
const previewDefaults = { small_width: 360, small_height: 640, medium_width: 768, medium_height: 1024, large_width: 1200, large_height: 760 };

function seedDatabase(database) {
  const categories = metadata.categories.map(({ label }, displayOrder) => ({ name: label, displayOrder }));
  const upsertCategory = database.prepare(`
    INSERT INTO categories (name, display_order, active) VALUES (?, ?, 1)
    ON CONFLICT(name) DO UPDATE SET display_order = excluded.display_order, active = 1
  `);
  const upsertProject = database.prepare(`
    INSERT INTO projects (id, title, category_id, category, description, image, component_key, display_order, active, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET title=excluded.title, category_id=excluded.category_id, category=excluded.category,
      description=excluded.description, image=excluded.image, component_key=excluded.component_key,
      display_order=excluded.display_order, active=excluded.active, updated_at=datetime('now')
  `);
  const upsertProjectData = database.prepare(`
    INSERT INTO project_data (project_id, data_json) VALUES (?, ?)
    ON CONFLICT(project_id) DO UPDATE SET data_json = excluded.data_json
  `);
  const deleteTechnologies = database.prepare("DELETE FROM project_technologies WHERE project_id = ?");
  const insertTechnology = database.prepare("INSERT INTO project_technologies (project_id, technology, display_order) VALUES (?, ?, ?)");
  const findCategoryId = database.prepare("SELECT id FROM categories WHERE name = ?");
  const upsertMetadata = database.prepare(`
    INSERT INTO portfolio_metadata (id, data_json) VALUES (1, ?)
    ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json
  `);
  const insertSettings = (table, values) => {
    const columns = Object.keys(values);
    database.prepare(`INSERT INTO ${table} (id, ${columns.join(", ")}) VALUES (1, ${columns.map(() => "?").join(", ")}) ON CONFLICT(id) DO NOTHING`).run(...Object.values(values));
  };

  database.exec("BEGIN IMMEDIATE");
  try {
    // The active catalog is an exact replacement; stale project rows are removed first.
    database.exec("DELETE FROM projects; DELETE FROM categories;");
    categories.forEach(({ name, displayOrder }) => upsertCategory.run(name, displayOrder));
    projects.forEach((project) => {
      const categoryId = findCategoryId.get(project.category).id;
      upsertProject.run(project.id, project.title, categoryId, project.category_label, project.description, project.image, project.component_key, project.display_order, Number(project.active));
      upsertProjectData.run(project.id, JSON.stringify(project.data));
      deleteTechnologies.run(project.id);
      project.technologies.forEach((technology, displayOrder) => insertTechnology.run(project.id, technology, displayOrder));
    });
    upsertMetadata.run(JSON.stringify(metadata));
    insertSettings("theme_settings", themeDefaults);
    insertSettings("card_settings", cardDefaults);
    insertSettings("animation_settings", animationDefaults);
    insertSettings("preview_settings", previewDefaults);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export { projects as projectSeed, seedDatabase };
