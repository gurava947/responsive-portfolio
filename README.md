# Practice.folio — Responsive Portfolio

A responsive portfolio experience that turns 35 front-end practice projects into a searchable, navigable product. It includes project detail routes, seeded portfolio metadata, a certificate page, responsive layouts, theme controls, and a Vercel-ready static deployment mode.

## Highlights

- 35 projects across responsive design, layout, ecommerce, HTML, CSS, Bootstrap, and JavaScript practice
- Search, category navigation, project detail routes, certificate information, and light/dark themes
- Responsive layouts reviewed across mobile, tablet, and desktop breakpoints
- Local SQLite-backed development workflow with build-time JSON export for static hosting
- Security response headers and bounded API error responses configured for deployment

## Tech stack

React, Vite, JavaScript, Bootstrap, Node.js, Express, SQLite, and automated frontend/backend checks.

## Run locally

Requirements: Node.js 22.5+ and npm.

```bash
npm install
npm start
```

The application initializes local data from `backend/db/project-seed.json` and `backend/db/portfolio-metadata.json`, then serves the frontend and local API at `http://127.0.0.1:3000`. Use `HOST` and `PORT` to change the listener.

## Verification

```bash
npm run build
npm test
```

Check the repository's audit and implementation notes for the current release verification details. The local SQLite database is development data; the Vercel deployment uses build-time exported data and does not depend on request-time database writes.

## Deployment

The project includes `vercel.json` and a static deployment path. Build-time data export keeps the public deployment compatible with serverless hosting while preserving the richer local API workflow for development.

## Links

- Live demo: https://responsive-portfolio-five-iota.vercel.app
- Source: https://github.com/gurava947/responsive-portfolio

## Maintenance notes

Keep project metadata and images in the repository, run the build and tests before publishing, and update this README when the project count, deployment mode, or supported commands change.
