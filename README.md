# Fundoo Notes — Frontend

React + Vite single-page application built for the
[Dheeraj-999/FundooNotes](https://github.com/Dheeraj-999/FundooNotes) Spring Boot API.

## Requirements

- Node.js 20.19+ (Node 22 recommended) and npm
- Backend running at `http://localhost:8080` (MySQL, Redis, ActiveMQ and RabbitMQ as configured by the backend)

## Run locally

```bash
npm install
cp .env.example .env.local   # optional; defaults work with the backend
npm run dev                  # http://localhost:5173
```

Vite proxies requests starting with `/api` to `http://localhost:8080`, so the browser
never deals with cross-origin issues in development. To point at a hosted backend,
set `VITE_API_BASE_URL` in `.env.local` and enable that origin in the backend CORS config.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run all Vitest tests once |
| `npm run test:watch` | Watch mode while developing |
| `npm run check` | Tests followed by a production build |

## Project structure

```
src/
  assets/        design assets
  components/    reusable UI (Navbar, NoteCard, LabelModal, ProtectedRoute, ...)
  pages/         screens (auth, dashboard, archive, trash, labels, reminders)
  services/      API calls (auth, notes, labels, reminders, batch import)
  hooks/         useAuth, useNotes, useLabels, useReminders
  utils/         apiClient, token, validators, error helpers
  router/        AppRoutes
  test/          Vitest setup
```

Each page answers: what data does the user need, which backend endpoint provides it,
and what local state renders the screen. API calls stay in `services/`, so components
remain presentational and easy to test.

## Backend connection (exact contract)

- Auth header: `Authorization: Bearer <token>` — added automatically by `apiClient`.
- Token key in `localStorage`: `token`; login returns `{ token, message }`.
- Registration returns `{ id, firstName, email }` and does **not** issue a token; the
  app follows a successful registration with a login request.
- All API paths are relative to `/api` (see table below).
- Error responses: `{ timestamp, status, error, message, path, validationErrors }`.

| Feature | Endpoints used by the UI |
| --- | --- |
| Auth | `POST /users/register`, `POST /users/login` |
| Notes | `GET /notes`, `POST /notes`, `PATCH /notes/{id}/pin`, `PATCH /notes/{id}/archive`, `PATCH /notes/{id}/trash` |
| Labels | `GET /labels`, `POST /labels`, `PUT /labels/{id}`, `DELETE /labels/{id}`, `POST /labels/{labelId}/notes/{noteId}`, `DELETE /labels/{labelId}/notes/{noteId}` |
| Reminders | `GET /reminders`, `POST /reminders`, `PUT /reminders/{id}`, `DELETE /reminders/{id}` |
| Import | `POST /batch/import/notes` (multipart field `file`, `.xlsx` only) |

Note fields are exactly `id`, `title`, `description`, `pinned`, `archived`, `trashed`,
`labels`; reminder times are local ISO strings such as `2026-11-30T10:00:00`.

`GET /notes` returns active, archived and trashed notes together because the backend
has no filter endpoint. The UI filters by `archived` / `trashed` locally, and keeps
search client-side for the same reason. Pin/archive/trash are toggles — the UI never
sends a desired boolean.

## Features

- Registration, login, JWT storage, logout and protected routes
- Email OTP password reset (request code → verify → set new password)
- Dashboard with note editor, card grid, search, pin/archive/trash actions
- Archive and trash views with unarchive/restore
- Label create/rename/delete and assign/remove on notes
- Reminder create/edit/delete with future-date validation
- Excel note import with loading, empty, error and success feedback
- Responsive design with mobile sidebar

## Password reset

The recovery flow calls `POST /api/users/forgot-password` with `{ email }`, then
`POST /api/users/reset-password` with `{ email, otp, newPassword }`. The backend
emails a 6-digit code over SMTP and stores it in Redis for 5 minutes; the code is
never returned in an API response. SMTP credentials are configured on the backend
with `APP_MAIL_USERNAME` and `APP_MAIL_PASSWORD` (see `MAIL_SETUP.md` in the backend
repository). The old `/api/redis/otp/*` debug endpoints were removed because they
exposed the code in HTTP responses.

## Not available in the backend API

These study-guide ideas are intentionally **not** faked in the UI: note editing and
permanent deletion, server-side search/pagination, colors, collaborators, logout
blacklisting, and attachments. See `BACKEND_NOTES.md` for recommended backend
additions.

## Branches

- `main` — documentation only
- `develop` — integration branch with the full application
- `feature/*` — one branch per use case, merged into `develop`
