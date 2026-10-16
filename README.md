# Practice.folio — Responsive Portfolio

A responsive portfolio with 35 active projects, the supplied certificate, score, themes, navigation, and locally stored project content. The catalog includes the earlier 23 sections plus 12 additional responsive design and ecommerce sections. Their project records and portfolio metadata are seeded into the app's local SQLite database, and the new project imagery is served from local assets; the website uses no remote data service.

## Run locally

Requirements: Node.js 22.5+ and npm.

```bash
npm install
npm start
```

The app builds the frontend, initializes `static-web-development.db` from `backend/db/project-seed.json` and `backend/db/portfolio-metadata.json`, then serves the website and local API at `http://127.0.0.1:3000` by default. Set `HOST` and `PORT` to change the listener.

## Local data

- `backend/db/project-seed.json` contains all 35 active projects and their component data.
- `backend/db/portfolio-metadata.json` contains navigation, site copy, theme presets, preview breakpoints, certificate details, exam score, and topics.
- `backend/db/seed.js` replaces stale project rows on initialization, so only the new project catalog remains.
- `src/services/portfolioApi.js` reads the local `/api/portfolio` endpoint. The website requires no external database configuration or remote data service.

The uploaded source archives remain unchanged. A new SQLite database is created when this app copy starts.
