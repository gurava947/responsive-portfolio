import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DATABASE_NAME, openDatabase } from "../backend/db/connection.js";
import { migrateDatabase } from "../backend/db/migrate.js";
import { seedDatabase } from "../backend/db/seed.js";
import { createProjectRepository } from "../backend/repositories/projectRepository.js";
import { createSettingsRepository } from "../backend/repositories/settingsRepository.js";
import { createPortfolioRepository } from "../backend/repositories/portfolioRepository.js";
import { createProjectService } from "../backend/services/projectService.js";
import { createSettingsService } from "../backend/services/settingsService.js";
import { createApiController } from "../backend/controllers/apiController.js";

const database = openDatabase(":memory:");
const outputPath = resolve("public/portfolio-data.json");

try {
  migrateDatabase(database);
  seedDatabase(database);

  const projectRepository = createProjectRepository(database);
  const settingsRepository = createSettingsRepository(database);
  const portfolioRepository = createPortfolioRepository(database);
  const controller = createApiController({
    projects: createProjectService(projectRepository),
    settings: createSettingsService(settingsRepository),
    portfolio: portfolioRepository,
    databaseName: DATABASE_NAME,
  });

  let payload;
  controller.getPortfolio({}, { json(value) { payload = value; } }, (error) => { throw error; });
  if (!Array.isArray(payload?.data?.projects) || payload.data.projects.length !== 35) {
    throw new Error("Vercel export did not include all 35 responsive portfolio projects.");
  }
  if (!Array.isArray(payload.data.certificates) || payload.data.certificates.length === 0) {
    throw new Error("Vercel export did not include certificate data.");
  }

  mkdirSync(resolve("public"), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(payload)}\n`);
  console.log(`Exported ${payload.data.projects.length} projects and ${payload.data.certificates.length} certificates to ${outputPath}.`);
} finally {
  database.close();
}
