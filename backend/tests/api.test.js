import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { createApp } from "../app.js";
import { DATABASE_NAME, openDatabase } from "../db/connection.js";
import { migrateDatabase } from "../db/migrate.js";
import { seedDatabase, projectSeed } from "../db/seed.js";
import { createProjectRepository } from "../repositories/projectRepository.js";
import { createSettingsRepository } from "../repositories/settingsRepository.js";
import { createPortfolioRepository } from "../repositories/portfolioRepository.js";

let database;
let server;
let baseUrl;

beforeEach(async () => {
  database = openDatabase(":memory:");
  migrateDatabase(database);
  seedDatabase(database);
  const app = createApp({
    database: {
      projectRepository: createProjectRepository(database),
      settingsRepository: createSettingsRepository(database),
      portfolioRepository: createPortfolioRepository(database),
    },
    databaseName: DATABASE_NAME,
    staticDirectory: false,
  });
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  server = undefined;
  if (database) database.close();
  database = undefined;
});

test("seeds all project records and remains idempotent", () => {
  const count = database.prepare("SELECT count(*) AS total FROM projects").get().total;
  assert.equal(count, 35);
  assert.equal(projectSeed.length, 35);
  seedDatabase(database);
  assert.equal(database.prepare("SELECT count(*) AS total FROM projects").get().total, 35);
  assert.equal(database.prepare("SELECT count(*) AS total FROM projects WHERE id = 'obsolete-static-seed'").get().total, 0);
  assert.equal(database.prepare("SELECT count(*) AS total FROM project_technologies").get().total, projectSeed.reduce((sum, project) => sum + project.technologies.length, 0));
});

test("upgrades a version-one database to normalized categories without losing data", () => {
  database.exec(`
    DROP TRIGGER projects_category_id_required_insert;
    DROP TRIGGER projects_category_id_required_update;
    DROP INDEX idx_projects_category_id;
    ALTER TABLE projects DROP COLUMN category_id;
    ALTER TABLE card_settings DROP COLUMN max_width;
    ALTER TABLE card_settings DROP COLUMN min_height;
    ALTER TABLE card_settings DROP COLUMN mobile_image_height;
    ALTER TABLE card_settings DROP COLUMN tablet_image_height;
    ALTER TABLE card_settings DROP COLUMN desktop_image_height;
    ALTER TABLE card_settings DROP COLUMN hover_highlight;
    ALTER TABLE card_settings DROP COLUMN border_top_color;
    ALTER TABLE card_settings DROP COLUMN border_right_color;
    ALTER TABLE card_settings DROP COLUMN border_bottom_color;
    ALTER TABLE card_settings DROP COLUMN border_left_color;
    PRAGMA user_version = 1;
  `);

  migrateDatabase(database);

  assert.equal(database.prepare("PRAGMA user_version").get().user_version, 3);
  assert.equal(database.prepare("SELECT count(*) AS total FROM projects").get().total, 35);
  assert.equal(database.prepare("SELECT count(*) AS total FROM projects WHERE category_id IS NULL").get().total, 0);
  assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
  assert.ok(database.prepare("PRAGMA table_info(card_settings)").all().some((column) => column.name === "max_width"));
  assert.ok(database.prepare("PRAGMA table_info(card_settings)").all().some((column) => column.name === "mobile_image_height"));
});

test("upgrades a version-two database with safe responsive card heights", () => {
  database.exec(`
    ALTER TABLE card_settings DROP COLUMN mobile_image_height;
    ALTER TABLE card_settings DROP COLUMN tablet_image_height;
    ALTER TABLE card_settings DROP COLUMN desktop_image_height;
    PRAGMA user_version = 2;
  `);

  migrateDatabase(database);

  const settings = database.prepare("SELECT mobile_image_height, tablet_image_height, desktop_image_height FROM card_settings WHERE id = 1").get();
  assert.equal(database.prepare("PRAGMA user_version").get().user_version, 3);
  assert.deepEqual({ ...settings }, {
    mobile_image_height: 150,
    tablet_image_height: 175,
    desktop_image_height: 190,
  });
});

test("returns ordered, searchable responsive project DTOs and category options", async () => {
  const response = await fetch(`${baseUrl}/api/projects?q=VR&limit=20`);
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.ok(result.data.total >= 5);
  const vrProject = result.data.items.find((project) => project.id === "vr-website-products");
  assert.ok(vrProject);
  assert.ok(vrProject.technologies.includes("Responsive Design"));
  assert.equal(vrProject.component_key, "vr-website-products");
  assert.equal(typeof vrProject.data, "object");

  const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
  const categories = await categoriesResponse.json();
  assert.ok(categories.data.some((category) => category.name === "Responsive Design"));
});

test("serves the full 35-project portfolio, theme, certificate, and score from local SQLite", async () => {
  const response = await fetch(`${baseUrl}/api/portfolio`);
  assert.equal(response.status, 200);
  const portfolio = (await response.json()).data;
  assert.equal(portfolio.totalProjects, 35);
  assert.equal(portfolio.projects.length, 35);
  assert.equal(portfolio.settings.profile.defaultValues.email, "guravak947@gmail.com");
  const footerProject = portfolio.projects.find((project) => project.id === "vr-website-footer-section");
  assert.ok(footerProject);
  assert.equal(footerProject.slug, "vr-website-footer-section");
  assert.equal(footerProject.data.logoUrl, "/vr-logo-img.png");
  assert.equal(footerProject.data.contactItems.length, 3);
  const portfolioBanner = portfolio.projects.find((project) => project.id === "portfolio-website-navbar-banner");
  assert.ok(portfolioBanner);
  assert.equal(portfolioBanner.data.bannerImage, "/portfolio-navbar-banner/banner.png");
  assert.equal(portfolioBanner.data.navigationLinks.length, 5);
  const ecommerceBanner = portfolio.projects.find((project) => project.id === "ecommerce-website-navbar-banner");
  assert.ok(ecommerceBanner);
  assert.equal(ecommerceBanner.data.logoUrl, "/ecommerce-website-navbar-banner/logo.png");
  assert.equal(ecommerceBanner.data.carouselSlides.length, 3);
  assert.equal(ecommerceBanner.data.carouselSlides[0].smallImage, "/ecommerce-website-navbar-banner/carousel-1-small.png");
  const sectionIds = ["portfolio-about-me-skills", "portfolio-projects-section", "portfolio-services-section", "portfolio-work-done-section", "portfolio-testimonials-section", "portfolio-footer-section"];
  const sectionProjects = portfolio.projects.filter((project) => sectionIds.includes(project.id));
  assert.equal(sectionProjects.length, 6);
  assert.equal(sectionProjects.find((project) => project.id === "portfolio-about-me-skills").data.skills.length, 4);
  assert.equal(sectionProjects.find((project) => project.id === "portfolio-projects-section").data.projects.length, 2);
  assert.equal(sectionProjects.find((project) => project.id === "portfolio-services-section").data.services.length, 3);
  assert.equal(sectionProjects.find((project) => project.id === "portfolio-testimonials-section").data.testimonials.length, 3);
  const responsiveSectionIds = [
    "responsive-features-section", "responsive-tools-section", "responsive-design-deliver-section",
    "responsive-logos-section", "design-tool-navbar-banner", "ecommerce-footer-section",
    "ecommerce-contact-us-section", "ecommerce-explore-section", "ecommerce-trending-blogs-section",
    "ecommerce-offers-section", "ecommerce-products-section", "ecommerce-services-section",
  ];
  const responsiveSections = portfolio.projects.filter((project) => responsiveSectionIds.includes(project.id));
  assert.equal(responsiveSections.length, 12);
  assert.equal(responsiveSections[0].sortOrder, 24);
  assert.equal(responsiveSections.at(-1).sortOrder, 35);
  assert.equal(responsiveSections.find((project) => project.id === "responsive-features-section").data.items.length, 6);
  assert.equal(responsiveSections.find((project) => project.id === "responsive-tools-section").data.features.length, 2);
  assert.equal(responsiveSections.find((project) => project.id === "responsive-logos-section").data.logos.length, 6);
  assert.equal(responsiveSections.find((project) => project.id === "ecommerce-footer-section").data.columns.length, 3);
  assert.equal(responsiveSections.find((project) => project.id === "ecommerce-explore-section").data.cards.length, 3);
  assert.equal(responsiveSections.find((project) => project.id === "ecommerce-trending-blogs-section").data.blogs.length, 2);
  assert.equal(responsiveSections.find((project) => project.id === "ecommerce-products-section").data.products.length, 2);
  assert.equal(responsiveSections.find((project) => project.id === "ecommerce-services-section").data.services.length, 3);
  assert.equal(portfolio.certificates.length, 1);
  assert.equal(portfolio.certificates[0].performance.find((item) => item.key === "score").value, "250/250");
  assert.ok(portfolio.theme.presets.dark);
});

test("seeds card appearance defaults to match the static reference", async () => {
  const response = await fetch(`${baseUrl}/api/settings`);
  assert.equal(response.status, 200);
  const { cardUI } = (await response.json()).data;
  assert.equal(cardUI.radius, 22);
  assert.equal(cardUI.borderColor, "#c8d1c1");
  assert.equal(cardUI.backgroundColor, "theme");
  assert.equal(cardUI.textColor, "theme");
  assert.equal(cardUI.fontFamily, "arial");
  assert.equal(cardUI.mobileImageHeight, 160);
  assert.equal(cardUI.hoverHighlight, "medium");
  assert.equal(cardUI.transitionDuration, 275);
  assert.equal(cardUI.transitionEasing, "standard");
});

test("validates settings patches, persists accepted values and rejects unsafe values", async () => {
  const accepted = await fetch(`${baseUrl}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cardUI: {
        radius: 18,
        backgroundColor: "theme",
        textColor: "theme",
        fontFamily: "georgia",
        maxWidth: 460,
        mobileImageHeight: 160,
        tabletImageHeight: 185,
        desktopImageHeight: 205,
      },
      animation: { scrollReveal: true, entranceIntensity: "subtle" },
    }),
  });
  assert.equal(accepted.status, 200);
  const settings = (await accepted.json()).data;
  assert.equal(settings.cardUI.topLeftRadius, 18);
  assert.equal(settings.cardUI.maxWidth, 460);
  assert.equal(settings.cardUI.mobileImageHeight, 160);
  assert.equal(settings.cardUI.tabletImageHeight, 185);
  assert.equal(settings.cardUI.desktopImageHeight, 205);
  assert.equal(settings.cardUI.fontFamily, "georgia");
  assert.equal(settings.animation.scrollReveal, true);

  seedDatabase(database);
  const afterReseed = await fetch(`${baseUrl}/api/settings`);
  const reseededSettings = (await afterReseed.json()).data.cardUI;
  assert.equal(reseededSettings.maxWidth, 460);
  assert.equal(reseededSettings.mobileImageHeight, 160);

  const rejected = await fetch(`${baseUrl}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardUI: { fontFamily: "url(javascript:alert(1))" } }),
  });
  assert.equal(rejected.status, 400);
  assert.equal((await rejected.json()).error.code, "REQUEST_ERROR");

  const outOfRangeHeight = await fetch(`${baseUrl}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardUI: { mobileImageHeight: 999 } }),
  });
  assert.equal(outOfRangeHeight.status, 400);

  const invalidContrast = await fetch(`${baseUrl}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardUI: { backgroundColor: "#ffffff", textColor: "#fefefe" } }),
  });
  assert.equal(invalidContrast.status, 400);
});

test("updates theme-following card colors when only the theme mode changes", async () => {
  const response = await fetch(`${baseUrl}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: { mode: "dark" } }),
  });
  assert.equal(response.status, 200);
  const settings = (await response.json()).data;
  assert.equal(settings.theme.mode, "dark");
  assert.equal(settings.cardUI.backgroundColor, "theme");
  assert.equal(settings.cardUI.textColor, "theme");
  assert.equal(settings.cardUI.borderTopColor, "theme");
});

test("returns bounded client errors and no internal exception details", async () => {
  const invalidLimit = await fetch(`${baseUrl}/api/projects?limit=100000`);
  assert.equal(invalidLimit.status, 400);
  const missingProject = await fetch(`${baseUrl}/api/projects/does-not-exist`);
  assert.equal(missingProject.status, 404);
  assert.deepEqual((await missingProject.json()).error, {
    code: "REQUEST_ERROR",
    message: "Project not found.",
  });
});
