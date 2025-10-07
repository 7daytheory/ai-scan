# ai-scan — Local development with Docker

This repository contains a Vite frontend and a simple Docker Compose setup to run the frontend, a Postgres database, and Adminer for DB browsing. The README explains how to run the stack in development and production, and provides troubleshooting tips for Windows.

## What I added

- `Dockerfile` — production Dockerfile (builds the Vite app and serves with nginx)
- `Dockerfile.dev` — development image (runs the Vite dev server, uses bind mounts)
- `docker-compose.yml` — frontend + Postgres + Adminer; picks dev or prod frontend image by env var
- `nginx.conf` — nginx config used by the production image; SPA fallback to `index.html`
- `.dockerignore` — files to exclude from Docker build context
- `.env.example` — example environment variables consumed by `docker-compose`

## Prerequisites

- Docker Desktop (Windows) with WSL2 backend recommended
- PowerShell (instructions below use PowerShell syntax)

## Quickstart — development (recommended)

1. Copy the example environment variables (only once):

```powershell
copy .env.example .env
```

2. Start the development stack (builds frontend dev image and starts services):

```powershell
docker compose up --build
```

Behavior:
- Frontend (Vite dev server) will be available at http://localhost:5173
- Adminer (DB UI) will be available at http://localhost:8081
- Postgres will be exposed on localhost:5432

To stop the stack, press Ctrl+C in the terminal and then run:

```powershell
docker compose down
```

## Quickstart — production image (locally)

Build the production frontend image and run it with nginx:

```powershell
# Build production image
docker build -f Dockerfile -t ai-scan-frontend:prod .

# Run the production image (serves on port 80 inside container -> port 8080 on host)
docker run --rm -p 8080:80 ai-scan-frontend:prod
```

Open http://localhost:8080 to view the built app.

## Run full stack in production mode with docker-compose

You can tell docker-compose to use the production Dockerfile by setting the env var `FRONTEND_DOCKERFILE` to `Dockerfile`. In PowerShell:

```powershell
$env:FRONTEND_DOCKERFILE = 'Dockerfile'
$env:NODE_ENV = 'production'
docker compose up --build
```

Or add those values to your `.env` file.

## Postgres / Adminer connection details

- Adminer: http://localhost:8081
- Use these values (match `.env` or `.env.example`):
  - System: PostgreSQL
  - Server: db
  - Port: 5432
  - Username: postgres
  - Password: postgres
  - Database: ai_scan

Note: from the host machine you can also connect to the DB at `localhost:5432` because the compose file maps the port.

## Useful npm commands (if you want to run without Docker)

```powershell
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build locally (Vite)
npm run preview
```

## Ports used by the compose stack

- 5173 — Vite dev server (frontend)
- 8080 — optional production frontend mapping (nginx)
- 8081 — Adminer UI
- 5432 — Postgres

If any of these ports are already in use on your machine, change the mappings in `docker-compose.yml`.

## Windows caveats and tips

- Use WSL2 with Docker Desktop for best filesystem performance. Bind mounts (host -> container) are slow on plain Windows paths.
- If `docker compose up` fails with permission or path errors, try running Docker Desktop, or re-open PowerShell as Administrator.
- If you have a local Postgres running on `5432`, stop it or change the port mapping in `docker-compose.yml`.

## Troubleshooting

- If builds are slow or dependencies fail: check Node version (Node 18+ recommended). You can also build with fewer layers by using a pinned package manager like pnpm.
- If the frontend container doesn't reflect file changes: verify the `volumes` entry is mounted and that the container is running the dev server (`npm run dev -- --host`). On Windows, file change events may behave slightly differently; using WSL paths can help.
- If nginx serves the app but routes 404: ensure `nginx.conf` `try_files` is present (SPA fallback to `index.html`).
- If `docker compose up` reports a port conflict, find the process using the port or change the mapping.

## Next steps / suggestions

- Add a small SQL `init` script mounted into `/docker-entrypoint-initdb.d` for Postgres if you need initial schema.
- Add healthchecks and a `depends_on` condition for graceful startup ordering.
- Add CI steps that build the production image and push to a registry.

If you want, I can:
- Add a small `docker-compose.override.yml` for local-only dev customizations
- Add a `Makefile` or simple PowerShell script to wrap the common commands
- Add DB migration/seed wiring

---

If you'd like, run `docker compose up --build` now and paste any errors here — I will help debug them step by step.
# React + TypeScript + Vite
## Assess your webpage with AI
<p>Scan your webpage to see how you can improve your SEO, if there are any dead links, spelling errors, missing images or files, etc </p>

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
