---
title: 'Add Onze Opstelling editing to Vandaag cards'
slug: 'onze-opstelling-vandaag'
created: '2026-02-20'
status: 'review'
implementation_status: 'review'
stepsCompleted: [1, 2, 3]
tech_stack: ['React 18', 'TypeScript', 'Redux Toolkit', 'react-bootstrap', 'vitest', 'react-testing-library']
files_to_modify:
  - 'src/components/matches/MobileLiveMatches/OwnPlayerSelector.tsx (new)'
  - 'src/components/matches/MobileLiveMatches/spec/OwnPlayerSelectorSpec.tsx (new)'
  - 'src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx'
  - 'src/utils/locales-nl.ts'
code_patterns:
  - 'OpponentPlayerSelector checkbox pattern with PlayerRow, search, auto-save'
  - 'editMatchPlayers thunk: {matchId, playerIds, blockAlso, newStatus, comment}'
  - 'selectPlayers selector returns PlayerModel[] from store'
  - 'user.playerId > 0 for logged-in check'
  - 'match.getTeamPlayerCount() returns 4 (Vttl) or 3 (Sporta)'
  - 'match.getPlayerFormation("onlyFinal") for confirmed lineup'
  - 'storeUtil must be mocked in component tests'
test_patterns:
  - 'spec/*Spec.tsx files in sibling spec/ directory'
  - 'renderWithProviders from utils/test-utils.tsx'
  - 'vi.mock for storeUtil and httpClient'
  - 'vitest + @testing-library/react + userEvent'
---

# Tech-Spec: Add Onze Opstelling editing to Vandaag cards

**Created:** 2026-02-20

## Overview

### Problem Statement

On the vandaag cards, captains can enter opponent lineups ("hun opstelling") but not our own lineup ("onze opstelling"). During a match, any logged-in user needs to be able to confirm which of our players are actually playing.

### Solution

Add an `OwnPlayerSelector` component (same UX as `OpponentPlayerSelector`) that lets any logged-in user select our players. Uses the existing `editMatchPlayers` endpoint with `blockAlso: true, newStatus: 'Major'`. Saving either our or their lineup triggers a Captain -> Major block upgrade server-side.

### Scope

**In Scope:**
- New `OwnPlayerSelector` component reusing the checkbox pattern from `OpponentPlayerSelector`
- Pre-start mode: "Selecteer spelers" button under "Onze opstelling" when no final formation is set
- In-progress mode: EditIcon next to "Overwinningen" (like "Tegenstanders" already has)
- Available players: active players with ranking in match.competition, sorted by frequency played in that team (synced matches only)
- Pre-selected: players whose `status === match.block`
- Save via `editMatchPlayers` with `blockAlso: true, newStatus: 'Major'`
- Block upgrade (Captain -> Major) handled server-side on both EditMatchPlayers and EditOpponentPlayers
- Any logged-in user can select players (not just captains/admins)

**Out of Scope:**
- Backend changes for Frenoy partial sync block upgrade (separate backend task)
- Changes to `isSyncedWithFrenoy` model (partial sync state)
- New backend endpoints (reuse existing `editMatchPlayers`)

## Context for Development

### Codebase Patterns

**Component pattern (from OpponentPlayerSelector):**
- Collapsed state: shows a `Button` with locale string -> click opens form
- Open state: search input + scrollable checkbox list + cancel/save buttons
- `PlayerRow` sub-component: label wrapping checkbox + name + ranking
- Auto-save: when `selectedPlayers.length === requiredPlayerCount`, call `handleSave` immediately
- Search: `latinize` function for accent-insensitive filtering
- Sort: selected players on top, then by frequency (descending)

**Data flow:**
- `editMatchPlayers` thunk -> `POST /matches/EditMatchPlayers` -> returns `IFullStoreMatchOwn` -> `simpleLoaded()` merges into store
- SignalR broadcasts `BroadcastReload` for Match entity, so other clients also get the update
- `editOpponentPlayers` thunk -> `POST /matches/EditOpponentPlayers` -> same return pattern

**Player data model:**
- `IPlayer.active: boolean` -- whether player is active in the club
- `IPlayer.getCompetition(competition).ranking` -- player's ranking in Vttl/Sporta (empty object if none)
- `IPlayer.getCompetition(competition).uniqueIndex` -- federation unique index
- `IMatchPlayer.status: MatchPlayerStatus` -- one of `'Play' | 'Major' | 'Captain' | 'NotPlay' | 'Maybe' | 'DontKnow'`
- `IMatchPlayer.playerId` -- links to `IPlayer.id`
- `match.block` -- the current block status for the match (determines which players are "confirmed")

**Login check:**
- `user.playerId > 0` is the standard logged-in check (used by MobileLiveMatches sync button)

**Existing `editMatchPlayers` usage (Teams.tsx:179, MatchesTable.tsx:75):**
- Called with `blockAlso: true/false`, `newStatus: 'Captain' | 'Major' | userStatus`
- For our use case: `blockAlso: true, newStatus: 'Major', comment: ''`

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/matches/MobileLiveMatches/OpponentPlayerSelector.tsx` | Reference implementation -- checkbox list, search, auto-save, PlayerRow |
| `src/components/matches/MobileLiveMatches/spec/OpponentPlayerSelectorSpec.tsx` | Reference test file -- mock patterns, createMockMatch, renderWithProviders |
| `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx` | `OurFormationPreStart` (line 245), `FormationsWithResults` (line 61) -- both need edit integration |
| `src/reducers/matchesReducer.ts` | `editMatchPlayers` thunk (line 153), `EditMatchPlayersParams` type (line 145) |
| `src/models/MatchModel.ts` | `getPlayerFormation` (line 226), `getOwnPlayers` (line 280), `getTeamPlayerCount` (line 203) |
| `src/models/TeamModel.ts` | `getMatches()` (line 124) -- needed for player frequency calculation |
| `src/models/PlayerModel.ts` | `getCompetition()` (line 46), `active` (line 11) |
| `src/utils/hooks/storeHooks.ts` | `selectPlayers` (line 51), `selectMatches` (line 46) |
| `src/models/model-interfaces.ts` | `IMatchPlayer` (line 146), `MatchPlayerStatus` (line 47), `IPlayerCompetition` (line 255) |
| `src/utils/locales-nl.ts` | Locale strings -- need to add `match.selectOwnPlayers` |
| `src/utils/test-utils.tsx` | `renderWithProviders`, `createTestStore` |

### Technical Decisions

1. **Reuse `editMatchPlayers`** -- it already accepts `{matchId, playerIds, blockAlso, newStatus}` and returns the updated match via `simpleLoaded`
2. **Player list source**: `selectPlayers` filtered by `active && getCompetition(match.competition).ranking` -- all active players with a ranking in the relevant competition
3. **Pre-selection**: `match.getOwnPlayers()` filtered by `ply.status === match.block` (when block is set) or `ply.status === 'Major'` (when synced) -- mirrors `getPlayerFormation('onlyFinal')` logic
4. **Frequency sorting**: count `playerId` appearances in `match.getTeam().getMatches().filter(m => m.isSyncedWithFrenoy)` -> `m.getOwnPlayers()` -- only synced matches count
5. **Block upgrade**: server-side -- both `EditMatchPlayers` and `EditOpponentPlayers` endpoints should upgrade Captain -> Major (backend change required)
6. **Login gate**: `user.playerId > 0` -- consistent with existing vandaag UI patterns
7. **PlayerRow reuse**: Duplicate the `PlayerRow` inline (it's 15 lines). The `OwnPlayerSelector` maps `IPlayer` to `{name: alias, ranking, uniqueIndex}` from `getCompetition()`.

## Implementation Plan

### Tasks

- [x] Task 1: Add locale string for own player selection
  - File: `src/utils/locales-nl.ts`
  - Action: Add `selectOwnPlayers: "Selecteer spelers"` in the `match` section (near `selectOpponents` at line 381)

- [x] Task 2: Create `OwnPlayerSelector` component
  - File: `src/components/matches/MobileLiveMatches/OwnPlayerSelector.tsx` (new)
  - Action: Create component following `OpponentPlayerSelector` pattern with these differences:
    - **Props**: `{ match: IMatch; initialOpen?: boolean; onClose?: () => void }` (same interface)
    - **Player source**: `useTtcSelector(selectPlayers)` filtered by `player.active && player.getCompetition(match.competition).ranking` (instead of fetching club players)
    - **Pre-selection**: On mount, find players from `match.getOwnPlayers()` whose `status === match.block` (or `status === 'Major'` if `match.isSyncedWithFrenoy`). Map each `IMatchPlayer.playerId` to the matching `IPlayer` from the filtered list.
    - **Frequency sorting**: Compute `playerFrequency` by iterating `match.getTeam().getMatches().filter(m => m.isSyncedWithFrenoy)`, then for each match `m.getOwnPlayers()`, counting `playerId` occurrences. Sort: selected first, then frequency descending.
    - **PlayerRow display**: Show `player.alias` as name, `player.getCompetition(match.competition).ranking` as ranking. Reuse the same `PlayerRow` styling (inline `getBackgroundColor`, checkbox + name + ranking layout).
    - **Save**: Dispatch `editMatchPlayers({ matchId: match.id, playerIds: selectedPlayers.map(p => p.id), blockAlso: true, newStatus: 'Major', comment: '' })`.
    - **Auto-save**: Same as opponent -- when `selectedPlayers.length === requiredPlayerCount`, trigger `handleSave`.
    - **Search**: Same `latinize` filter on `player.alias`.
    - **No loading state needed**: Players are already in the Redux store (loaded at app init), no lazy fetch.
    - **Collapsed state**: Show `<Button size="sm" variant="outline-primary">{t('match.selectOwnPlayers')}</Button>`.
    - **Max selection**: `match.getTeamPlayerCount()` (4 for Vttl, 3 for Sporta).

- [x] Task 3: Integrate `OwnPlayerSelector` into pre-start mode
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx`
  - Action: Modify `OurFormationPreStart` (line 245):
    - Add `const user = useTtcSelector(selectUser);` to read login state
    - When `playingPlayers.length === 0` (no confirmed formation): if `user.playerId > 0`, show `<OwnPlayerSelector match={match} />` instead of the "Opstelling onbekend" message
    - When `playingPlayers.length > 0` (has formation): add an `EditIcon` next to the section title (like `FormationsWithResults` does for opponents) that toggles an `OwnPlayerSelector` below, gated by `user.playerId > 0` and `match.games.length === 0` (no games played yet)
    - Import `OwnPlayerSelector` and `selectUser`

- [x] Task 4: Integrate `OwnPlayerSelector` into in-progress mode
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx`
  - Action: Modify `FormationsWithResults` (line 61):
    - Add state: `const [showEditOwn, setShowEditOwn] = useState(false);`
    - Add `const user = useTtcSelector(selectUser);` to read login state
    - Next to the "Overwinningen" `SectionTitle` (line 69), add an `EditIcon` (same pattern as opponents column at line 77-82), shown when `canEditOpponents` (i.e. `match.games.length === 0`) and `user.playerId > 0`
    - Below the own players list, when `showEditOwn` is true, render `<OwnPlayerSelector match={match} initialOpen onClose={() => setShowEditOwn(false)} />`
    - Import `OwnPlayerSelector` and `selectUser` (selectUser is already imported)

- [x] Task 5: Write tests for `OwnPlayerSelector`
  - File: `src/components/matches/MobileLiveMatches/spec/OwnPlayerSelectorSpec.tsx` (new)
  - Action: Mirror `OpponentPlayerSelectorSpec.tsx` structure:
    - Mock `storeUtil` with `getTeam` returning a mock team with `getMatches()` returning synced matches
    - Mock `httpClient.post` returning a mock match response
    - Create `testPlayers` array of `IStorePlayer` objects (active, with vttl competition ranking)
    - Create `createMockMatch` helper (like opponent spec) with `getOwnPlayers`, `getTeamPlayerCount`, `getTeam` mocks
    - Preloaded store state with `players: testPlayers`
    - Tests:
      1. Renders "Selecteer spelers" button when form is closed
      2. Shows player list when opened with data
      3. Filters players with latinize search (accent-insensitive)
      4. Toggles player selection
      5. Disables excess players when max reached
      6. Pre-selects players matching match.block status
      7. Sorts selected players to top of list
      8. Auto-saves when reaching required player count
      9. Cancel button closes form and resets state
      10. Only shows active players with competition ranking

- [x] Task 6: Run tests and lint
  - Action: Run `npm test` and `npm run lint` to verify all changes pass

### Acceptance Criteria

- [x] AC1: Given a vandaag card in pre-start mode with no confirmed formation and a logged-in user, when the card renders, then a "Selecteer spelers" button is shown under "Onze opstelling"
- [x] AC2: Given a vandaag card in pre-start mode with a confirmed formation and a logged-in user, when the card renders, then an edit icon appears next to "Onze opstelling" that opens the player selector
- [x] AC3: Given the own player selector is open, when it renders, then it shows all active players with a ranking in the match's competition (Vttl or Sporta), sorted by: selected first, then by frequency of play in that team (synced matches only)
- [x] AC4: Given the own player selector is open and the match has `block: 'Captain'`, when it renders, then players with `status === 'Captain'` in the match are pre-selected
- [x] AC5: Given 4 players are selected (Vttl match), when the 4th player is checked, then the form auto-saves by dispatching `editMatchPlayers` with `blockAlso: true, newStatus: 'Major'`
- [x] AC6: Given a vandaag card in in-progress mode (has their players but no games), when a logged-in user views it, then an edit icon appears next to "Overwinningen" that opens the own player selector
- [x] AC7: Given the own player selector is open, when the user types in the search box, then the player list filters by name (accent-insensitive via latinize)
- [x] AC8: Given the own player selector is open, when the user clicks cancel, then the form closes and selection resets
- [x] AC9: Given a user is not logged in (`user.playerId === 0`), when the vandaag card renders, then no "Selecteer spelers" button or edit icon is shown for our formation
- [x] AC10: Given games have been played (`match.games.length > 0`), when the card renders in either mode, then the edit icon for our formation is not shown

## Additional Context

### Dependencies

- **Backend (separate task)**: `EditMatchPlayers` endpoint must upgrade `match.block` from `Captain` to `Major` (and all Captain-status players to Major) when called. Same for `EditOpponentPlayers`.
- **No new npm packages** needed -- all dependencies already in the project.
- **Players already loaded**: The app's initial load fetches all players, so `selectPlayers` always has data when vandaag cards render.

### Testing Strategy

**Unit tests** (`OwnPlayerSelectorSpec.tsx`):
- Component rendering (collapsed button, open form, player list)
- Selection mechanics (toggle, max count, auto-save)
- Pre-selection from match.block
- Search filtering
- Cancel/reset behavior

**Manual testing**:
- Open vandaag page with a match in pre-start mode, verify "Selecteer spelers" appears
- Select 4 players, verify auto-save triggers and formation updates
- Open vandaag page with a match in progress, verify edit icon next to "Overwinningen"
- Test with non-logged-in user -- no edit controls visible
- Test with match that has games -- no edit controls visible

### Notes

- The `OwnPlayerSelector` does not need a loading state since players come from the Redux store (loaded during app init). This is simpler than `OpponentPlayerSelector` which lazily fetches club roster data.
- The backend block upgrade (Captain -> Major) must be implemented before this feature fully works. Without it, saving will set the selected players to Major but won't upgrade the match block or other Captain-status players.
- When `match.block` is empty (no block set yet), pre-selection should be empty -- no players are "confirmed" yet.
- Future consideration: when `isSyncedWithFrenoy` is extended to support partial sync states, the edit icon visibility logic may need updating.

## File List

- `src/utils/locales-nl.ts` (modified) - Added `selectOwnPlayers` locale string
- `src/components/matches/MobileLiveMatches/OwnPlayerSelector.tsx` (new) - OwnPlayerSelector component
- `src/components/matches/MobileLiveMatches/spec/OwnPlayerSelectorSpec.tsx` (new) - 10 unit tests
- `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx` (modified) - Integration into pre-start and in-progress modes

## Dev Agent Record

### Implementation Notes

- Component follows `OpponentPlayerSelector` pattern closely but is simpler: no loading state needed since players come from Redux store
- `PlayerRow` receives `competition` prop to resolve ranking via `player.getCompetition(competition).ranking`
- Pre-selection uses `match.getOwnPlayers()` filtered by `status === match.block` (or `'Major'` when synced)
- Frequency sorting counts player appearances in synced team matches via `match.getTeam().getMatches()`
- Login gate (`user.playerId > 0`) applied in both `OurFormationPreStart` and `FormationsWithResults`
- Edit icon hidden when `match.games.length > 0` (games already played)
- All 165 tests pass (10 new + 155 existing), zero lint errors on changed files

## Change Log

- 2026-02-20: Implemented OwnPlayerSelector feature - all 6 tasks complete, 10 tests added, all ACs satisfied
