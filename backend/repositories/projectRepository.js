export function createProjectRepository(database) {
  const findProjects = database.prepare(`
    SELECT
      p.id, p.title, p.category, c.name AS category_name, p.description, p.image, p.component_key,
      p.display_order, p.active, d.data_json,
      COALESCE((
        SELECT json_group_array(technology)
        FROM (
          SELECT technology FROM project_technologies
          WHERE project_id = p.id ORDER BY display_order
        )
      ), '[]') AS technologies_json
    FROM projects p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN project_data d ON d.project_id = p.id
    WHERE p.active = 1
      AND (? IS NULL OR c.name = ?)
      AND (? = '' OR lower(p.title || ' ' || p.description || ' ' || p.category || ' ' || COALESCE((
        SELECT group_concat(technology, ' ') FROM project_technologies WHERE project_id = p.id
      ), '')) LIKE ? ESCAPE '!')
    ORDER BY p.display_order ASC
    LIMIT ? OFFSET ?
  `);
  const findById = database.prepare(`
    SELECT p.id, p.title, p.category, c.name AS category_name, p.description, p.image, p.component_key,
      p.display_order, p.active, d.data_json,
      COALESCE((
        SELECT json_group_array(technology)
        FROM (
          SELECT technology FROM project_technologies
          WHERE project_id = p.id ORDER BY display_order
        )
      ), '[]') AS technologies_json
    FROM projects p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN project_data d ON d.project_id = p.id
    WHERE p.id = ? AND p.active = 1
  `);
  const findCategories = database.prepare(`
    SELECT name, display_order FROM categories WHERE active = 1 ORDER BY display_order, name
  `);
  const countProjects = database.prepare(`
    SELECT count(*) AS total FROM projects p JOIN categories c ON c.id = p.category_id
    WHERE p.active = 1
      AND (? IS NULL OR c.name = ?)
      AND (? = '' OR lower(p.title || ' ' || p.description || ' ' || p.category || ' ' || COALESCE((
        SELECT group_concat(technology, ' ') FROM project_technologies WHERE project_id = p.id
      ), '')) LIKE ? ESCAPE '!')
  `);

  function mapProject(row) {
    if (!row) return null;
    let data;
    let technologies;
    try {
      data = JSON.parse(row.data_json || "{}");
      technologies = JSON.parse(row.technologies_json || "[]");
    } catch (error) {
      throw new Error(`Stored project data is invalid for "${row.id}".`, { cause: error });
    }
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      category_name: row.category_name,
      description: row.description,
      image: row.image,
      component_key: row.component_key,
      display_order: row.display_order,
      active: Boolean(row.active),
      technologies,
      data,
    };
  }

  return {
    list({ category = null, query = "", limit = 100, offset = 0 } = {}) {
      const search = query ? `%${query.replace(/[!%_]/g, (character) => `!${character}`)}%` : "";
      const rows = findProjects.all(category, category, query, search, limit, offset);
      return {
        items: rows.map(mapProject),
        total: countProjects.get(category, category, query, search).total,
        limit,
        offset,
      };
    },
    get(id) {
      return mapProject(findById.get(id));
    },
    categories() {
      return findCategories.all().map((row) => ({ name: row.name, display_order: row.display_order }));
    },
  };
}
