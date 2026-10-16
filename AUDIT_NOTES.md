# Final Audit Notes — Responsive Portfolio

## Vercel deployment

`vercel.json` selects the Vite build, uses `npm run build:vercel`, publishes `dist`, and rewrites direct SPA paths to `index.html`. The build exports all 35 project records and the certificate into `public/portfolio-data.json` using an in-memory database; no SQLite file is written to Vercel storage or required for requests. Theme/card settings remain visitor-specific in browser `localStorage`. The existing Express + SQLite API remains available for local `npm start`.

## Existing fixes and validation

Scrollbar thumbs/tracks remain hidden while native page/container scrolling works. Theme/card API synchronization is debounced in local mode; Vercel mode avoids server API calls. Navigation keeps real `href` behavior, and browser Back/Forward clears stale device preview selection.

`npm test`: 4 frontend + 9 backend tests pass. `npm run build:vercel` passes and exports 35 projects, 1 certificate, and 5 categories. Browser preview rendered all 35 project cards. Vercel config enables direct-route fallback and retains `nosniff`, `no-referrer`, and same-origin frame headers. Production dependencies previously audited with `npm audit --omit=dev`: 0 vulnerabilities.

The Vercel build needs no secrets or environment variables. If you later need server-synchronized writes across users/devices, add a managed persistent database and API; do not store writes in a Vercel function's local SQLite file.
