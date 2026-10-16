export function createApiController({ projects, settings, portfolio, databaseName }) {
  return {
    health(_request, response) {
      response.json({ data: { status: "ok", database: databaseName } });
    },
    listProjects(request, response, next) {
      try { response.json({ data: projects.list(request.query) }); } catch (error) { next(error); }
    },
    getProject(request, response, next) {
      try { response.json({ data: projects.get(request.params.id) }); } catch (error) { next(error); }
    },
    categories(_request, response, next) {
      try { response.json({ data: projects.categories() }); } catch (error) { next(error); }
    },
    getPortfolio(_request, response, next) {
      try {
        const metadata = portfolio.get();
        const result = projects.list({ limit: 100, offset: 0 });
        const categorySlugs = Object.fromEntries((metadata.categories || []).map(({ label, slug }) => [label, slug]));
        const items = result.items.map((record) => ({
          id: record.id, slug: record.id, route: `/projects/${record.id}`, sortOrder: record.display_order,
          category: record.category, categoryFilter: record.category_name,
          categorySlug: categorySlugs[record.category_name] || "", title: record.title,
          description: record.description, image: record.image, imageAlt: `${record.title} project preview`,
          technologies: record.technologies, data: record.data, assets: [], sections: [], actions: [],
        }));
        response.json({ data: { ...metadata, projects: items, totalProjects: result.total } });
      } catch (error) { next(error); }
    },
    getSettings(_request, response, next) {
      try { response.json({ data: settings.get() }); } catch (error) { next(error); }
    },
    updateSettings(request, response, next) {
      try { response.json({ data: settings.update(request.body) }); } catch (error) { next(error); }
    },
  };
}
