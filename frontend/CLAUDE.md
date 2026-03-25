# TTC Aalst Frontend

React-Redux TypeScript app (Vite) for TTC Aalst table tennis club.

## Commands

```sh
bun start          # dev server (connects to localhost:5193 backend)
bun run build      # tsc + vite build
bun run test       # vitest
bun run lint       # eslint
bun run format     # prettier --write
bun run knip       # find dead code
bun run deploy     # build + gh-pages
```

## Architecture

- **Redux Toolkit** with domain slices in `src/reducers/`, selectors in `src/reducers/selectors/`
- **SignalR** real-time updates via `src/utils/hooks/useSignalR.ts`
- **HTTP client**: `src/utils/httpClient.ts` (auto-adds `/api` prefix + bearer token)
- **Routing**: react-router-dom v6, localized routes via `t.route()` from `src/locales.ts`
- **Models**: class-based with business logic (not plain interfaces)
- Backend URL hardcoded in `src/config.ts`

## Testing

- Vitest + React Testing Library + Playwright (e2e)
- Test files: `**/spec/**/*Spec.ts(x)`
- Shared utility: `src/utils/test-utils.tsx` (`renderWithProviders`)
- Boy scout rule: when touching a component, add or update tests

## Coding Patterns

- Localization: `t('key')` from `src/locales.ts` (Dutch)
- Date handling: `dayjs` with `nl-be` locale
- ESLint 9 flat config, max line length 160
- Husky: pre-commit (lint-staged), pre-push (knip + tests)
