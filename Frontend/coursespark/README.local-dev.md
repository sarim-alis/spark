# CourseSpark - Local Development Notes

This repo runs a Vite + React app. For local development we disable external auth and use mock entities so every page renders without external services.

## Quick start

```bash
npm install
npm run dev
```

Dev server usually runs at http://localhost:5173 (will increment if occupied).

## Mock environment
- Base44 client is configured with `requiresAuth: false` in `src/api/base44Client.js`.
- `src/api/devConfig.js` forces development mode and provides in-memory mocks:
  - `mockUser` (with ai tools/tutor unlocked)
  - `mockCourse` (list/filter/get/create/update/delete + sample lessons)
  - `mockEnrollment` (list/filter/update)
- `src/api/entities.js` exports the mock entities in dev.

## Routes
All routes are nested under `Layout` in `src/App.jsx`.
- `/` → Dashboard
- `/homepage`
- `/coursecreator`
- `/mycourses`
- `/courseeditor/:id`
- `/courseviewer/:id`
- `/storefront`
- `/aitutor`
- `/aitools`
- `/paymentsuccess`
- `/subscriptionsuccess`
- `/profile`
- `/adminsync`

## Notes
- `Layout` uses React Router’s `<Outlet />` to render pages.
- Links were migrated to param routes for editor/viewer (`/courseeditor/:id`, `/courseviewer/:id`).
- Old `src/pages/index.jsx` router was removed to avoid confusion.

## Troubleshooting
- If a port is busy, Vite will pick the next one (5173 → 5174 → 5175 ...). Check the terminal for the active port.
- If you see blank screens, ensure `src/main.jsx` wraps `<App />` in `<BrowserRouter>` and `./index.css` is imported.
- For any errors related to Base44, confirm `requiresAuth: false` in `src/api/base44Client.js` and `isDevelopment = true` in `src/api/devConfig.js`.
