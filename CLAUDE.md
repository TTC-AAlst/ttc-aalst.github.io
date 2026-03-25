# TTC Aalst - Monorepo

Website for TTC Aalst table tennis club.

## Structure

- `frontend/` - React, TypeScript, Vite frontend (see `frontend/CLAUDE.md`)
- `backend/` - C#, .NET 8, WebApi, MySQL backend (see `backend/CLAUDE.md`)

## Rules

- **Boy scout rule**: When touching a component, add or update tests for it.

## Local Development

### With Docker (recommended)

```bash
docker compose -f docker-compose.dev.yml up
```

- Frontend: http://localhost:3000 (Vite HMR)
- Backend: http://localhost:5193/swagger (dotnet watch)
- MySQL: localhost:7202

### Without Docker

```bash
# Start just the database
docker compose -f docker-compose.dev.yml up db

# Backend (in separate terminal)
cd backend
dotnet run --project src/Ttc.WebApi

# Frontend (in separate terminal)
cd frontend
bun install
bun start
```
