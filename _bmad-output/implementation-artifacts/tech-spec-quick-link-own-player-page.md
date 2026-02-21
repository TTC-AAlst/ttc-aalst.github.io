---
title: 'Quick link to own player page'
slug: 'quick-link-own-player-page'
created: '2026-02-21'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['React 18', 'TypeScript', 'Redux Toolkit', 'react-router-dom', 'Material-UI', 'react-bootstrap', 'vitest', 'react-testing-library']
files_to_modify:
  - 'src/components/dashboard/DashboardUpcomingMatches.tsx'
  - 'src/components/users/Profile.tsx'
  - 'src/components/skeleton/Header/HeaderNavigation.tsx'
  - 'src/components/players/Players.tsx'
  - 'src/utils/locales-nl.ts'
code_patterns:
  - 'PlayerLink component (class-based): wraps <Link> with player slug URL resolution'
  - 'PlayerModel.slug = name.toLowerCase().replace(/\s/g, "-")'
  - 'URL pattern: t.route("player").replace(":playerId", encodeURI(slug))'
  - 'user.playerId > 0 for logged-in check'
  - 'selectUser hook for current user state (playerId, teams, security)'
  - 'selectPlayers + players.find(p => p.id === user.playerId) to resolve current player'
  - 'goto() helper in HeaderNavigation for nav + close drawer'
  - 'Dashboard already resolves currentPlayer on line 21'
  - 'Profile receives player as IPlayer prop in ProfilePlayerDetails'
  - 'HeaderNavigation already has user via selectUser'
  - 'PlayersToolbar is a class component -- add button in parent Players.tsx instead'
  - 'Players.tsx already imports selectUser and selectPlayers'
test_patterns:
  - 'No existing tests for any of the four target components'
  - 'spec/*Spec.tsx files in sibling spec/ directory'
  - 'renderWithProviders from utils/test-utils.tsx'
  - 'vi.mock for storeUtil and httpClient'
  - 'vitest + @testing-library/react + userEvent'
  - 'Components using <Link> need <MemoryRouter> wrapper'
---

# Tech-Spec: Quick link to own player page

**Created:** 2026-02-21

## Overview

### Problem Statement

Logged-in players have no easy, discoverable way to navigate to their own player page (`/speler/:slug`). The header user icon goes to `/profiel` (account settings), and there's no shortcut to the player stats/match history page anywhere in the app.

### Solution

Add four entry points to the current user's player page, all gated on `user.playerId > 0`:

1. **Dashboard**: "Hallo {name}" greeting becomes a styled link with visual affordance
2. **Profile tab**: "Mijn spelerspagina" button next to "Uitloggen"
3. **Hamburger menu**: "Mijn spelerspagina" entry above "Spelers" (logged in only)
4. **Players page**: "Mijn pagina" button in the toolbar (same style as dashboard)

### Scope

**In Scope:**
- Dashboard greeting as clickable link with icon to signal interactivity
- Profile "Profiel" tab gets a "Mijn spelerspagina" button near "Uitloggen"
- Hamburger menu gets a "Mijn spelerspagina" entry above "Spelers" (logged in only)
- Players page toolbar gets a "Mijn pagina" button
- All entry points gated on `user.playerId > 0`

**Out of Scope:**
- Header icon changes (stays pointing to `/profiel`)
- Changes to the player page itself
- New navigation patterns or redesigns

## Context for Development

### Codebase Patterns

**Player URL resolution:**
- `PlayerModel.slug` = `name.toLowerCase().replace(/\s/g, '-')` (`PlayerModel.ts:42`)
- URL: `t.route('player').replace(':playerId', encodeURI(slug))`
- `PlayerLink` component handles this but is class-based and expects `IStorePlayer` prop
- For `IPlayer` (which Profile receives), construct URL directly with `player.name.toLowerCase().replace(/\s/g, '-')`

**Current user resolution (per-component):**
- **Dashboard** (`DashboardUpcomingMatches.tsx:21`): `const currentPlayer = user.playerId ? players.find(p => p.id === user.playerId) : null` — `currentPlayer` is `IStorePlayer`, already resolved
- **Profile** (`Profile.tsx:112`): `ProfilePlayerDetails` receives `player: IPlayer` prop — has `player.name` for slug
- **Hamburger** (`HeaderNavigation.tsx:21`): `const user = useTtcSelector(selectUser)` — needs to also select players to resolve slug
- **Players page** (`Players.tsx:13`): already imports `selectPlayers` and `selectUser` — can resolve player inline

**Hamburger menu pattern:**
- `HeaderNavigation.tsx` uses `<MenuItem onClick={() => goto(t.route('...'))}>{t('nav...')}</MenuItem>`
- `goto()` closes the drawer and navigates
- "Spelers" entry at line 56

**Players page structure:**
- `PlayersToolbar` is a **class component** — cannot use hooks
- `Players.tsx` is a **functional component** that renders `PlayersToolbar` inside `renderTabContent` (line 76)
- Button should be added in `Players.tsx` near the toolbar, not inside `PlayersToolbar`

**Locale structure:**
- `nav` section (line 94): navigation labels — `matches`, `matchesToday`, `players`, etc.
- `dashboard` section (line 150): `greeting: "Hallo ${name}"` with emoji
- `profile` section (line 111): `tooltip`, `main`, edit labels
- `login` section: `logoutButton: "Uitloggen"` (line 172)

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/dashboard/DashboardUpcomingMatches.tsx` | Dashboard greeting "Hallo {name}" (line 67-71), `currentPlayer` resolved (line 21) |
| `src/components/users/Profile.tsx` | `ProfilePlayerDetails` with `player` prop and "Uitloggen" button (line 112-133) |
| `src/components/skeleton/Header/HeaderNavigation.tsx` | Hamburger menu, `goto()` pattern, "Spelers" at line 56, `user` at line 21 |
| `src/components/players/Players.tsx` | Parent of `PlayersToolbar`, functional component, imports `selectUser` + `selectPlayers` (line 13) |
| `src/components/players/Players/PlayersToolbar.tsx` | Class component — toolbar with search + sort + Excel button |
| `src/components/players/controls/PlayerLink.tsx` | Reference: class-based `<Link>` wrapper for player URLs |
| `src/utils/locales-nl.ts` | `nav` section (line 94), `dashboard.greeting` (line 151), `login.logoutButton` (line 172) |
| `src/utils/hooks/storeHooks.ts` | `selectUser` (line 15), `selectPlayers` (line 51) |
| `src/models/PlayerModel.ts` | `slug` getter (line 42) |

### Technical Decisions

1. **Use `<Link>` directly** instead of `PlayerLink` — `PlayerLink` is class-based and expects `IStorePlayer`. Direct `<Link>` with inline slug construction is simpler for all four entry points.
2. **Player URL construction**: `t.route('player').replace(':playerId', encodeURI(slug))` — same pattern as `PlayerLink` uses internally.
3. **Dashboard slug**: `currentPlayer` is `IStorePlayer` — use `new PlayerModel(currentPlayer).slug` (consistent with codebase).
4. **Profile slug**: `player` is `IPlayer` — use `player.name.toLowerCase().replace(/\s/g, '-')` directly (IPlayer has no `.slug` getter).
5. **Visual affordance on dashboard**: Style the greeting as a link (color + hover underline) and add a small `fa-arrow-right` icon to signal clickability.
6. **Hamburger**: Add `selectPlayers` selector to resolve current player slug. Only render entry when `user.playerId > 0`.
7. **Players page**: Add button in `Players.tsx` (functional) rather than `PlayersToolbar` (class) to avoid class-to-hook issues.

## Implementation Plan

### Helper: Player URL construction

All four entry points need to construct the same URL. The pattern is:

```typescript
import PlayerModel from '../../models/PlayerModel';
// For IStorePlayer:
const playerUrl = t.route('player').replace(':playerId', encodeURI(new PlayerModel(currentPlayer).slug));
// For IPlayer (Profile):
const playerUrl = t.route('player').replace(':playerId', encodeURI(player.name.toLowerCase().replace(/\s/g, '-')));
```

### Tasks

- [ ] Task 1: Add locale strings
  - File: `src/utils/locales-nl.ts`
  - Action: Add to the `nav` section (after line 109, before the closing `}`):
    ```
    myPlayerPage: "Mijn spelerspagina",
    ```

- [ ] Task 2: Dashboard greeting — make "Hallo {name}" a clickable link
  - File: `src/components/dashboard/DashboardUpcomingMatches.tsx`
  - Action:
    1. Add import: `import PlayerModel from '../../models/PlayerModel';`
    2. Compute player URL after line 21: `const playerUrl = currentPlayer ? t.route('player').replace(':playerId', encodeURI(new PlayerModel(currentPlayer).slug)) : '';`
    3. Replace the `<span>` at lines 67-70 with a `<Link>` wrapping the greeting:
       ```tsx
       {currentPlayer && (
         <Link to={playerUrl} className="link-hover-underline" style={{fontSize: '1.1em', fontWeight: 500, color: '#333', whiteSpace: 'nowrap', textDecoration: 'none'}}>
           {t('dashboard.greeting', {name: currentPlayer.firstName})}
           <i className="fa fa-arrow-right" style={{fontSize: '0.7em', marginLeft: 6, opacity: 0.5}} />
         </Link>
       )}
       ```
    4. `Link` is already imported on line 2.

- [ ] Task 3: Profile tab — add "Mijn spelerspagina" button next to "Uitloggen"
  - File: `src/components/users/Profile.tsx`
  - Action:
    1. Add import: `import { Link } from 'react-router-dom';` — already imported via `useNavigate`, add `Link` to that import
    2. In `ProfilePlayerDetails` (line 112-133), compute player URL:
       ```typescript
       const playerSlug = player.name.toLowerCase().replace(/\s/g, '-');
       const playerUrl = t.route('player').replace(':playerId', encodeURI(playerSlug));
       ```
    3. Add a `<Link>` button before the "Uitloggen" `MaterialButton` (before line 125):
       ```tsx
       <Link to={playerUrl}>
         <MaterialButton
           variant="contained"
           label={t('nav.myPlayerPage')}
           color="primary"
           style={{marginTop: 15, marginRight: 10}}
         />
       </Link>
       ```
    4. Note: `ProfilePlayerDetails` is a const arrow function, not a class — the URL computation goes inside the function body. Convert from implicit return `() => (...)` to explicit `() => { ... return (...) }`.

- [ ] Task 4: Hamburger menu — add "Mijn spelerspagina" entry above "Spelers"
  - File: `src/components/skeleton/Header/HeaderNavigation.tsx`
  - Action:
    1. Add `selectPlayers` to the import from `storeHooks` (line 11)
    2. Add import: `import PlayerModel from '../../../models/PlayerModel';`
    3. Inside the component, after line 22, add:
       ```typescript
       const players = useTtcSelector(selectPlayers);
       const currentPlayer = user.playerId ? players.find(p => p.id === user.playerId) : null;
       const playerUrl = currentPlayer ? t.route('player').replace(':playerId', encodeURI(new PlayerModel(currentPlayer).slug)) : '';
       ```
    4. Before the "Spelers" `<MenuItem>` (line 56), add:
       ```tsx
       {currentPlayer && <MenuItem onClick={() => goto(playerUrl)}>{t('nav.myPlayerPage')}</MenuItem>}
       ```

- [ ] Task 5: Players page — add "Mijn pagina" button near toolbar
  - File: `src/components/players/Players.tsx`
  - Action:
    1. Add imports: `import { Link } from 'react-router-dom';` and `import PlayerModel from '../../models/PlayerModel';`
    2. Inside the `Players` component (after line 22), add:
       ```typescript
       const user = useTtcSelector(selectUser);
       const currentPlayer = user.playerId ? players.find(p => p.id === user.playerId) : null;
       const playerUrl = currentPlayer ? t.route('player').replace(':playerId', encodeURI(new PlayerModel(currentPlayer).slug)) : '';
       ```
       Note: `players` is already available from `selectPlayers` (line 24, before filtering). Use the unfiltered source: need to call `useTtcSelector(selectPlayers)` separately for the full list, or use `players` before filtering. Since `players` on line 24 is the full list (before filter is applied on line 25-27), the `find` can use the original selector. Actually, `players` is reassigned on line 24 with `.slice()` then filtered — so use the selector directly: `const allPlayers = useTtcSelector(selectPlayers);` and find from that.
    3. Inside `renderTabContent` (line 74), add a link before `<PlayersToolbar>`:
       ```tsx
       {currentPlayer && (
         <div style={{marginLeft: 15, marginBottom: 5}}>
           <Link to={playerUrl} className="link-hover-underline" style={{fontWeight: 500, color: '#333', textDecoration: 'none'}}>
             {t('nav.myPlayerPage')}
             <i className="fa fa-arrow-right" style={{fontSize: '0.7em', marginLeft: 6, opacity: 0.5}} />
           </Link>
         </div>
       )}
       ```

- [ ] Task 6: Write tests
  - Files:
    - `src/components/dashboard/spec/DashboardUpcomingMatchesSpec.tsx` (new)
    - `src/components/users/spec/ProfileSpec.tsx` (new)
    - `src/components/skeleton/Header/spec/HeaderNavigationSpec.tsx` (new)
    - `src/components/players/spec/PlayersSpec.tsx` (new)
  - Action: For each component, create a test file with:
    - Mock `storeUtil` (required for components using `PlayerModel`)
    - Preloaded store state with `user: { playerId: 42, teams: [], security: [] }` and matching player in `players` array
    - Tests:
      1. **Logged in**: Renders a link containing the player slug URL
      2. **Not logged in** (`playerId: 0`): No link to player page is rendered
    - Wrap renders in `<MemoryRouter>` for `<Link>` support
    - Use `renderWithProviders` from `src/utils/test-utils.tsx`
  - Note: Dashboard and Players tests will need mock match data for the component to render (upcoming matches). Keep mocks minimal — just enough to render the greeting/toolbar.

- [ ] Task 7: Run tests and lint
  - Action: Run `npm test` and `npm run lint` to verify all changes pass

### Acceptance Criteria

- [ ] AC1: Given a logged-in user on the dashboard, when they see "Hallo {name}", then it is a clickable `<Link>` with an arrow icon that navigates to `/speler/{user-slug}`
- [ ] AC2: Given a non-logged-in user on the dashboard, when the dashboard renders, then no greeting or player link is shown (current behavior: greeting only shows when `currentPlayer` exists)
- [ ] AC3: Given a logged-in user on the Profile page "Profiel" tab, when they see the "Uitloggen" button, then a "Mijn spelerspagina" button is visible before it that navigates to `/speler/{user-slug}`
- [ ] AC4: Given a logged-in user opening the hamburger menu, when they see the menu items, then "Mijn spelerspagina" appears directly above "Spelers" and navigates to `/speler/{user-slug}`
- [ ] AC5: Given a non-logged-in user opening the hamburger menu, when they see the menu items, then no "Mijn spelerspagina" entry is shown
- [ ] AC6: Given a logged-in user on the Players page, when they see the toolbar area, then a "Mijn spelerspagina" link with arrow icon is visible above the toolbar that navigates to `/speler/{user-slug}`
- [ ] AC7: Given a non-logged-in user on the Players page, when they see the toolbar, then no "Mijn spelerspagina" link is shown
- [ ] AC8: Given games have started or the match is already synced, the dashboard entry points still work (they are not gated on match state, only on login)

## Additional Context

### Dependencies

- No new npm packages needed
- No backend changes needed
- Players are already loaded at app init, so `selectPlayers` always has data when these components render

### Testing Strategy

**Unit tests** (4 new spec files, ~8 test cases total):
- Each integration point: renders link when logged in, no link when not logged in
- Link `href` matches expected `/speler/{slug}` pattern
- All tests use `renderWithProviders` with preloaded store state + `<MemoryRouter>`

**Manual testing:**
- Log in, verify dashboard "Hallo {name}" is clickable with arrow icon, navigates correctly
- Log in, open Profile tab, verify "Mijn spelerspagina" button before "Uitloggen"
- Log in, open hamburger, verify "Mijn spelerspagina" above "Spelers"
- Log in, go to /spelers, verify "Mijn spelerspagina" link above the search toolbar
- Log out, verify none of the four entry points are visible
- Test on mobile (hamburger + dashboard)

### Notes

- `PlayerLink` is class-based — for new code, use direct `<Link>` with inline slug construction
- The greeting already conditionally renders only when `currentPlayer` exists, so the login gate is implicit there
- `PlayersToolbar` is a class component — the button is added in parent `Players.tsx` (functional) instead
- No existing tests for any of the four target components — all tests are new
- `IPlayer` (Profile) vs `IStorePlayer` (Dashboard/Players/Hamburger) — different interfaces, slug resolution differs slightly
- `ProfilePlayerDetails` currently uses implicit arrow return `() => (...)` — needs conversion to explicit block `() => { return (...) }` to add URL computation
