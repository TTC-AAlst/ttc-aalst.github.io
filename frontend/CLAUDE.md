# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-Redux TypeScript application for managing table tennis club data (TTC Aalst). The app uses real-time updates via SignalR and integrates with a backend API for match scheduling, player management, team rankings, and club information.

## Development Commands

```bash
# Start development server (connects to localhost:5193 backend by default)
npm start

# Run tests (Jest with jsdom environment)
npm test

# Lint TypeScript/TSX files
npm run lint
npm run lint-fix

# Build production bundle
npm build

# Deploy to GitHub Pages
npm run deploy
```

## Backend Configuration

The backend URL is hardcoded in `src/config.ts`. When running locally (`localhost`), the app connects to `http://localhost:5193`. The development backend port `5193` is used throughout the codebase.

## Architecture

### State Management (Redux Toolkit)

The application uses Redux Toolkit with slices organized by domain:

- **store.ts**: Central store configuration with all reducers
- **reducers/**: Domain-specific reducers and async thunks
  - `matchesReducer.ts`: Match data, scores, reports, comments
  - `playersReducer.ts`: Player roster, rankings, predictions
  - `teamsReducer.ts`: Team management and rankings
  - `clubsReducer.ts`: Club information
  - `configReducer.ts`: App configuration and UI state
  - `userReducer.ts`: Authentication and user profile
  - `readonlyMatchesReducer.ts`: Opponent match data
  - `matchInfoReducer.ts`: Extended match information
- **reducers/selectors/**: Memoized selectors for derived state
- **utils/hooks/storeHooks.ts**: Typed Redux hooks (`useTtcSelector`, `useTtcDispatch`)

All async data fetching uses `createAsyncThunk` from Redux Toolkit.

### Real-time Updates (SignalR)

The app establishes a SignalR connection after initial load (`useSignalR` hook):

- Connects to `/hubs/ttc` endpoint
- Receives `BroadcastReload` events for entity updates (Player, Match, Team, Club, Config)
- On reconnection, re-fetches all data (matches, teams, players, clubs, config)
- Uses bearer token from localStorage for authentication

### Data Models

Domain models are class-based with methods (not pure interfaces):

- `MatchModel.ts`: Match data with helper methods for team/opponent info
- `PlayerModel.ts`: Player information and statistics
- `TeamModel.ts`: Team formations and rankings
- `ClubModel.ts`: Club details and metadata
- `model-interfaces.ts`: TypeScript interfaces for all models

Models contain business logic and computed properties alongside data.

### HTTP Client

Centralized HTTP client in `utils/httpClient.ts`:

- Uses `superagent` for requests
- Automatically adds bearer token from localStorage
- URL construction: `/api` prefix added automatically
- Routes to localhost:5193 in dev, production backend otherwise
- Export utilities for Excel downloads (players, teams, scoresheets)

### Initial Load Pattern

The app performs a two-phase initialization (`useInitialLoad` hook):

1. **Primary load**: Validates token, fetches core data (clubs, config, players, teams, matches)
2. **Secondary load**: After primary completes, loads team rankings and syncs matches with Frenoy

This pattern ensures data dependencies are met before loading derived data.

### Component Organization

- **components/App/**: Top-level app shell, intro, sponsors
- **components/admin/**: Admin panels for managing all entities
- **components/matches/**: Match display, formation, scores, reports
- **components/players/**: Player profiles and roster
- **components/teams/**: Team pages, rankings, opponent overviews
- **components/users/**: Login, profile, password management
- **components/controls/**: Reusable UI components (buttons, inputs, etc.)
- **components/other/**: Miscellaneous pages (links, facts, general info)
- **components/skeleton/**: Loading skeletons

### Routing

Routing uses `react-router-dom` v6 with localized routes:

- Routes defined in `routes.tsx`
- All routes wrapped in `<App Component={...} />` pattern
- Localized route paths via `t.route()` from `locales.ts`
- Helper functions in `browseTo` for programmatic navigation

## Coding Patterns

### Localization

All user-facing strings use the `t()` function from `locales.ts`:

```typescript
import t from '../locales';
t('match.report.reportPosted')
t.route('matches')
```

Locale files:
- `locales.ts`: Main locale exports
- `utils/locales-nl.ts`: Dutch translations
- `utils/locales-nl-facts.ts`: Facts/trivia translations

### Date Handling

Uses `moment.js` with `nl-be` locale (Belgian Dutch):

```typescript
import moment from 'moment';
moment().format('YYYY-MM-DD')
```

Configured globally in `index.tsx`.

### TypeScript Configuration

- `noImplicitAny: false` - allows implicit any types
- `strict: true` - other strict checks enabled
- React JSX mode
- Max line length: 160 characters

### Testing

Tests use Jest with jsdom environment and React Testing Library for component tests:
- Test files: `**/spec/**/*Spec.ts` (models) or `**/spec/**/*Spec.tsx` (components)
- Config: `jest.config.js` (uses `test-tsconfig.json`)
- Run individual test: `npm test -- <path/to/spec>`
- Shared test utility: `src/utils/test-utils.tsx` (`renderWithProviders` with Redux store)
- **Boy scout rule:** when touching a component, add or update tests for it

### ESLint

ESLint 9 flat config (`eslint.config.js`) with `typescript-eslint` and `eslint-plugin-react`:
- Arrow functions preferred for components
- Max line length: 160 characters
- `no-console`: off, `no-debugger`: warn
- `no-undef` / `no-unused-vars`: off (TypeScript handles these)
- `react-hooks/exhaustive-deps`: warn (keep dependency arrays correct)

## Key Integrations

### Frenoy Sync

Matches sync with the Frenoy system (table tennis federation):
- `frenoyMatchSync` thunk in `matchesReducer.ts`
- Auto-syncs matches after their scheduled date
- Manual force-sync available
- Updates match scores, players, and game results

### Image Uploads

Image upload flow via `httpClient.ts`:
- `upload()`: Generic file upload
- `uploadImage()`: Base64 image upload
- Requires bearer token authentication
- Supports type-based categorization

### Analytics

Google Analytics 4 integration:
- Tracking ID in `config.ts` (`ga` property)
- Uses `react-ga4` package

## Environment & Deployment

- **Development**: Localhost frontend → `localhost:5193` backend
- **Production**: Deployed to GitHub Pages (`https://ttc-aalst.be`)
- **Deploy command**: `npm run deploy` (builds and pushes to gh-pages branch with CNAME)

## Important Files

- `src/store.ts`: Redux store setup
- `src/routes.tsx`: Route definitions and navigation helpers
- `src/config.ts`: Backend URLs and environment config
- `src/utils/initialLoad.ts`: App initialization sequence
- `src/utils/hooks/useSignalR.ts`: Real-time connection management
- `src/utils/httpClient.ts`: API communication layer
- `src/locales.ts`: Internationalization entry point
