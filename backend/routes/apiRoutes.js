import { Router } from "express";

export function createApiRoutes(controller) {
  const router = Router();
  router.get("/health", controller.health);
  router.get("/portfolio", controller.getPortfolio);
  router.get("/projects", controller.listProjects);
  router.get("/projects/:id", controller.getProject);
  router.get("/categories", controller.categories);
  router.get("/settings", controller.getSettings);
  router.patch("/settings", controller.updateSettings);
  return router;
}
