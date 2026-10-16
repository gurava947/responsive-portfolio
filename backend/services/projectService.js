const MAX_PAGE_SIZE = 100;
const MAX_QUERY_LENGTH = 120;

export function createProjectService(repository) {
  return {
    list(query) {
      const category = query.category?.trim() || null;
      const search = query.q?.trim() || "";
      const limit = query.limit === undefined ? MAX_PAGE_SIZE : Number(query.limit);
      const offset = query.offset === undefined ? 0 : Number(query.offset);
      if (category && (category.length > 120 || /[\u0000-\u001f]/.test(category))) {
        throw Object.assign(new Error("Invalid category filter."), { status: 400 });
      }
      if (search.length > MAX_QUERY_LENGTH || /[\u0000-\u001f]/.test(search)) {
        throw Object.assign(new Error(`Search query must be at most ${MAX_QUERY_LENGTH} characters.`), { status: 400 });
      }
      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
        throw Object.assign(new Error(`limit must be an integer between 1 and ${MAX_PAGE_SIZE}.`), { status: 400 });
      }
      if (!Number.isInteger(offset) || offset < 0 || offset > 10000) {
        throw Object.assign(new Error("offset must be a non-negative integer no greater than 10000."), { status: 400 });
      }
      return repository.list({ category, query: search.toLowerCase(), limit, offset });
    },
    get(id) {
      if (typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
        throw Object.assign(new Error("Invalid project id."), { status: 400 });
      }
      const project = repository.get(id);
      if (!project) throw Object.assign(new Error("Project not found."), { status: 404 });
      return project;
    },
    categories() {
      return repository.categories();
    },
  };
}
