# Static reference parity — implementation notes

ఈ responsive portfolio‌ను అందించిన static portfolio reference‌ను ఆధారంగా తీసుకుని visually మరియు behavior-wise align చేశాను. Project-specific content (35 responsive projects, certificate, individual project routes) అలాగే ఉంచబడింది.

## ఏం align చేశాం

- **Theme palette మరియు typography:** light/dark tokens, page background, text colors, theme toggle styling.
- **Portfolio shell:** header/navigation, hero, certificate/achievement block, project filters, grid, footer, detail pages.
- **Project cards:** thumbnail height, border/background/text controls, hover/focus reveal, transitions, spacing, responsive behavior.
- **Profile/settings UI:** theme controls, card layout/appearance controls, API-backed settings, responsive preview controls.
- **Reference defaults:** radius 22px, 160px mobile card image, Arial card font, medium hover highlight, 275ms standard easing; schema మరియు seed defaults కూడా sync చేశారు.
- **Responsive behavior:** project grid మరియు device-preview presets యథాతథంగా ఉంచి, mobile/tablet/desktop breakpoints‌ను మార్చలేదు.
- **Navigation/data:** responsive project names, certificate URL, project routes మరియు live data మారలేదు.

## ప్రధానంగా నవీకరించిన files

- `src/App.css`
- `src/styles/theme.css`
- `src/styles/portfolio-effects.css`
- `src/hooks/useTheme.js`
- `src/components/ProjectCard.jsx`
- `src/components/ProfilePage/index.jsx` మరియు `index.css`
- `src/App.jsx`
- `backend/db/seed.js` మరియు `backend/db/schema.sql`
- `backend/tests/api.test.js` — static-reference card defaults కోసం regression test

## Security మరియు validation

ఇప్పటికే ఉన్న backend security controls‌ను అలాగే ఉంచాను. Settings API input validation, out-of-range values/unsafe font values rejection, contrast validation, safe error responses, SQLite persistence మరియు response security headers కొనసాగుతున్నాయి. Live health endpoint‌లో `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: SAMEORIGIN`, `Cross-Origin-Resource-Policy: same-origin` ధృవీకరించబడ్డాయి.

## Validation

- `npm test` — **9 tests passed**.
- `npm run build` — విజయవంతం.
- Live preview — 35 project cards render అయ్యాయి; desktop viewport‌లో document horizontal overflow లేదు.

## స్థానికంగా నడపడం

```bash
npm ci
npm start
```

Live preview: <https://3010-iergn1kr6ktgcwo29vjov-05783cde.sg2.manus.computer/>
