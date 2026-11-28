# FundooNotes Frontend

A React + Vite single-page application for the Fundoo Notes Spring Boot backend
([Dheeraj-999/FundooNotes](https://github.com/Dheeraj-999/FundooNotes)).

## Branch strategy

| Branch | Purpose |
| --- | --- |
| `main` | Documentation only. Contains this README and nothing else. |
| `develop` | Integration branch with the complete application. |
| `feature/*` | One branch per use case, merged into `develop` via pull request style commits. |

Start with `develop` to see or run the app:

```bash
git checkout develop
npm install
npm run dev
```

Open <http://localhost:5173>. The backend must be running on
<http://localhost:8080>; the dev server proxies `/api` requests to it.

Full setup, scripts, API mapping, and testing notes live in the `develop`
branch README.

## Use cases

- Registration and login with JWT token handling
- Protected dashboard routes
- Create, pin, archive, trash, and restore notes
- Client-side search and filters
- Label create, rename, delete, assign, and remove
- Reminder create, update, and delete
- Excel note import and user feedback states

## Status

Implementation and tests are maintained on `develop`.
