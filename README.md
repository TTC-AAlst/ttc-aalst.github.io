# TTC Aalst

Website for TTC Aalst table tennis club.

## Local Development

### With Docker (recommended)

```sh
docker compose -f docker-compose.dev.yml up
```

- Frontend: http://localhost:3000 (Vite HMR)
    - Backend port: `src/config.ts`
- Backend: http://localhost:5193/swagger (dotnet watch)
- MySQL: localhost:7202

### Without Docker

```sh
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

## Frontend

React, TypeScript, Vite app in `frontend/`.

```sh
cd frontend
bun start          # dev server (connects to localhost:5193 backend)
bun run build      # tsc + vite build
bun run test       # vitest
bun run lint       # eslint
bun run format     # prettier --write
bun run knip       # find dead code
```

### Git Hooks (Husky)

- **pre-commit**: lint-staged (eslint --fix + prettier) on staged files
- **pre-push**: knip (dead code check) + tests

### Bootstrap Breakpoints

```
screen-xs-min: 576px;
screen-sm-min: 768px;
screen-md-min: 992px;
screen-lg-min: 1200px;
screen-xl-min: 1400px;
```

## Backend

ASP.NET Core 8.0 Web API in `backend/`. Integrates with Frenoy (Belgian table tennis federation) for match data sync.

```sh
cd backend
dotnet build Ttc.slnx
dotnet test Ttc.slnx
dotnet format Ttc.slnx
dotnet run --project src/Ttc.WebApi
dotnet watch --project src/Ttc.WebApi
```

### Deploy

```sh
cp .example.env .env
cp src/Ttc.WebApi/appsettings.json src/Ttc.WebApi/appsettings.Release.json
docker-compose up -d --build
```

### Database

```sh
docker run --name ttc-mysql -p 7202:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:8.0
```

### EF Migrations

Migrations run at startup.

```sh
cd src/Ttc.DataAccess
dotnet ef database update

# Create/remove migrations
dotnet ef migrations add InitialCreate
dotnet ef migrations remove
dotnet ef database drop -f
```

### New Season

Go to Admin > Params and update the "year" param.
