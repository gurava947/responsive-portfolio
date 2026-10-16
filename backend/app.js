import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { createApiController } from "./controllers/apiController.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { createApiRoutes } from "./routes/apiRoutes.js";
import { createProjectService } from "./services/projectService.js";
import { createSettingsService } from "./services/settingsService.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function createApp({ database, databaseName, staticDirectory = resolve(projectRoot, "dist") }) {
  const app = express();
  const projectService = createProjectService(database.projectRepository);
  const settingsService = createSettingsService(database.settingsRepository);
  const controller = createApiController({
    projects: projectService,
    settings: settingsService,
    portfolio: database.portfolioRepository,
    databaseName,
  });

  app.disable("x-powered-by");
  app.use((_request, response, next) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Frame-Options", "SAMEORIGIN");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    next();
  });
  app.use(express.json({ limit: "32kb", strict: true }));
  app.use("/api", createApiRoutes(controller));
  app.use("/api", notFoundHandler);

  if (staticDirectory !== false && existsSync(staticDirectory)) {
    app.use(express.static(staticDirectory, {
      index: false,
      fallthrough: true,
      maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
      setHeaders(response, path) {
        if (/\.[\da-f]{8,}\.(?:js|css)$/i.test(path)) response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      },
    }));
    app.get("*path", (request, response, next) => {
      if (request.path.startsWith("/api/")) return next();
      response.sendFile(resolve(staticDirectory, "index.html"));
    });
  }

  app.use(errorHandler);
  return app;
}
