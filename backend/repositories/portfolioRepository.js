export function createPortfolioRepository(database) {
  const selectMetadata = database.prepare("SELECT data_json FROM portfolio_metadata WHERE id = 1");

  return {
    get() {
      const row = selectMetadata.get();
      if (!row) throw new Error("Local portfolio metadata is missing.");
      try {
        return JSON.parse(row.data_json);
      } catch (error) {
        throw new Error("Stored local portfolio metadata is invalid.", { cause: error });
      }
    },
  };
}
