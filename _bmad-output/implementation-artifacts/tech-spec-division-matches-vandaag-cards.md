---
title: 'Division matches on vandaag cards'
slug: 'division-matches-vandaag-cards'
created: '2026-02-21'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['React 18', 'TypeScript', 'Redux Toolkit', 'react-bootstrap', 'dayjs', 'vitest', 'react-testing-library']
files_to_modify:
  - 'src/utils/locales-nl.ts'
  - 'src/components/matches/Match/OtherMatchPlayerResults.tsx'
  - 'src/components/matches/MobileLiveMatches/DivisionMatchesSection.tsx (new)'
  - 'src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx'
code_patterns:
  - 'MatchActionButtons (line 114-234): ButtonGroup with toggle buttons + fullscreen Modals'
  - 'getOpponentMatches already dispatched in MatchActionButtons useEffect (line 128-130)'
  - 'opponentMatches already selected in MatchActionButtons (line 122-123) — filters by match.competition + match.frenoyDivisionId'
  - 'selectReadOnlyMatches wraps in MatchModel — isBeingPlayed() available on readonly matches'
  - 'OpponentMatches component: Table with home/away teams, score, clickable rows expanding to OtherMatchPlayerResultsTableRow'
  - 'OtherMatchPlayerResults: shows player columns, has "Volledig wedstrijdblad" toggle to ReadonlyIndividualMatches'
  - 'ReadonlyIndividualMatches: full individual game results table (up to 16 rows)'
  - 'TeamMatchesWeek filtering: readonlyMatches.filter(m => m.competition === comp && m.frenoyDivisionId === divId && m.shouldBePlayed)'
  - 'Modal pattern: fullscreen Modal with zIndex 99999, closeButton header'
  - 'frenoyReadOnlyMatchSync: auto-called per match on getOpponentMatches, backend has 10min rate limit'
  - 'SYNC_COOLDOWN_MS = 10 * 60 * 1000 for client-side sync cooldown'
  - 'shouldSync checks: !isSyncedWithFrenoy && date is past && shouldBePlayed'
test_patterns:
  - 'No existing tests for MatchActionButtons or MobileLiveMatches'
  - 'spec/*Spec.tsx files in sibling spec/ directory'
  - 'renderWithProviders from utils/test-utils.tsx'
  - 'vi.mock for storeUtil and httpClient'
  - 'vitest + @testing-library/react + userEvent'
---

# Tech-Spec: Division matches on vandaag cards

**Created:** 2026-02-21

## Overview

### Problem Statement

During a match day, players using the vandaag page can only see their own matches. They have no way to see what other teams in their division are doing today without navigating to the week page (`/ploegen/:competition/:team/week`).

### Solution

Add an "Afdeling" button to the vandaag card button row. On click, it expands an inline section below the button row showing other division matches happening today (team names + scores). Clicking a specific match row opens a full-screen modal with individual game results (up to 16 rows). Division matches auto-sync with Frenoy every 10 minutes (backend already rate-limits Frenoy API calls to once per 10min per match).

### Scope

**In Scope:**
- "Afdeling" button in `MatchActionButtons` `<ButtonGroup>`
- Inline collapsible section below button row showing division matches happening today
- Each match row shows home/away teams and score (reuse `OpponentMatches` table, but filtered to today only)
- Clicking a match row opens a full-screen modal with individual game results (reuse `OtherMatchPlayerResults` / `ReadonlyIndividualMatches`)
- Trigger `getOpponentMatches` on first expand (already dispatched in `MatchActionButtons` useEffect)
- Auto-resync readonly matches every 10min via `frenoyReadOnlyMatchSync` (client-side `setInterval`)
- Hide "Afdeling" button when no other division matches are happening today
- Filter readonly matches by `frenoyDivisionId` and `isBeingPlayed()`

**Out of Scope:**
- Backend changes (rate limiting already exists in `FrenoyMatchesApi`)
- HTTP-level rate limiting hardening
- Changes to existing `OpponentMatches`, `OtherMatchPlayerResults`, or `ReadonlyIndividualMatches` components
- Showing matches from other weeks/days

## Context for Development

### Codebase Patterns

**MatchActionButtons structure (`MobileLiveMatchInProgress.tsx:114-234`):**
- State variables for each toggle/modal (`showGames`, `showReportModal`, `showOpponentModal`, etc.)
- `useEffect` on line 128 already dispatches `getOpponentMatches({ teamId: match.teamId, opponent: match.opponent })`
- `opponentMatches` selector on line 122 already gets readonly matches filtered by `match.competition` + `match.frenoyDivisionId`
- BUT: `selectOpponentMatches` filters by specific opponent (home/away clubId+teamCode) — for "Afdeling" we need ALL division matches, not just one opponent's
- ButtonGroup (line 141-172) with OverlayTrigger tooltips on each button
- Below ButtonGroup: conditional content sections (showGames) and fullscreen Modals

**Division match filtering (from `TeamMatchesWeek.tsx:19-23`):**
```typescript
const otherMatches = readonlyMatches
  .filter(m => m.competition === teamCompetition)
  .filter(m => m.frenoyDivisionId === team.frenoy.divisionId)
  .filter(m => m.shouldBePlayed);
```
For vandaag, add `.filter(m => m.isBeingPlayed())` to limit to today, and `.filter(m => !m.isOurMatch)` to exclude our own match.

**OpponentMatches component (`OpponentMatches.tsx:22-106`):**
- Props: `{ readonlyMatches: IMatch[], team: ITeam, roundSwitchButton?, opponent? }`
- Renders a `<Table>` with clickable rows that toggle `OtherMatchPlayerResultsTableRow`
- Each row: date | home team | (formation) | away team | (formation) | score
- `OtherMatchPlayerResultsTableRow` renders inline `OtherMatchPlayerResults` below the row
- For our use case: we DON'T want the inline expand (it's too big) — we want a fullscreen modal instead

**OtherMatchPlayerResults (`OtherMatchPlayerResults.tsx:7-45`):**
- Shows two columns (home/away players) with a "Volledig wedstrijdblad" toggle button
- Toggle switches to `ReadonlyIndividualMatches` (full game-by-game table)
- This is what should go in the fullscreen modal

**ReadonlyIndividualMatches (`IndividualMatches.tsx:141-188`):**
- Full game-by-game results table with player names, sets, running score
- Up to 16 rows — too much for inline display

**Auto-sync pattern (from `MobileLiveMatches.tsx:11,25-30`):**
- `SYNC_COOLDOWN_MS = 10 * 60 * 1000` (10 minutes)
- `frenoyMatchSync` dispatched for each match with `forceSync: true`
- Button disabled during cooldown
- For division matches: use `frenoyReadOnlyMatchSync` instead, same cooldown pattern

**Data availability:**
- `getOpponentMatches` is already dispatched in `MatchActionButtons` useEffect (line 128-130)
- First call fetches from backend + syncs each match with Frenoy; subsequent calls are cached (`opponentMatchesLoaded`)
- `selectReadOnlyMatches` provides all fetched readonly matches wrapped in `MatchModel`
- Need to use `selectReadOnlyMatches` directly (not `selectOpponentMatches` which filters by specific opponent)

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx` | `MatchActionButtons` (line 114-234): button row + modals. Main file to modify. |
| `src/components/matches/Match/OpponentMatches.tsx` | `OpponentMatches` table component (line 22-106). Renders division match rows. |
| `src/components/matches/Match/OtherMatchPlayerResults.tsx` | `OtherMatchPlayerResults` (line 7-45): player columns + full view toggle. Goes in modal. |
| `src/components/matches/Match/IndividualMatches.tsx` | `ReadonlyIndividualMatches` (line 141-188): full game results table. |
| `src/components/matches/Match/OpponentMatchScore.tsx` | Score display for readonly matches. |
| `src/components/teams/TeamMatchesWeek.tsx` | Reference for division match filtering pattern (line 19-23). |
| `src/reducers/readonlyMatchesReducer.ts` | `getOpponentMatches` thunk (line 9), `frenoyReadOnlyMatchSync` (line 35). |
| `src/reducers/selectors/selectOpponentMatches.ts` | `selectOpponentMatches` — filters by specific opponent. NOT suitable for all-division view. |
| `src/utils/hooks/storeHooks.ts` | `selectReadOnlyMatches` (line 46) — all readonly matches as MatchModel. |
| `src/components/matches/MobileLiveMatches/MobileLiveMatches.tsx` | Sync cooldown pattern (line 11, 25-30). |
| `src/utils/locales-nl.ts` | Locale strings — `match.tabs` section (line 339-355). |

### Technical Decisions

1. **Reuse `OtherMatchPlayerResultsTableRow` for inline expand** — clicking a match row expands the compact player columns (home/away players with win counts) inline, same as the week page. This is the default view of `OtherMatchPlayerResults`.
2. **Fullscreen modal only for "Volledig wedstrijdblad"** — the "Volledig wedstrijdblad bekijken" button inside `OtherMatchPlayerResults` currently toggles to `ReadonlyIndividualMatches` inline. For the vandaag card context, this should open a fullscreen modal instead (16 rows is too much inline). This requires either: (a) adding an `onFullView` callback prop to `OtherMatchPlayerResults` that opens the modal instead of toggling inline, or (b) creating a wrapper component that replaces the toggle behavior.
3. **Use `selectReadOnlyMatches`** (not `selectOpponentMatches`) to get all division matches. Filter by `match.competition`, `match.frenoyDivisionId`, `isBeingPlayed()`, and `!isOurMatch`.
4. **`getOpponentMatches` already dispatched** in `MatchActionButtons` useEffect — no need to dispatch again on button click. The data will already be in the store.
5. **Auto-sync with `setInterval`**: Every 10 minutes, re-dispatch `frenoyReadOnlyMatchSync` for each today's division match. Backend's `FrenoyNoPesterCache` ensures Frenoy is not contacted more than once per 10min per match. Client-side interval is the trigger; backend is the rate limiter.
6. **Hide button when no matches**: Compute `todayDivisionMatches` from the filtered readonly matches. If empty, don't render the button.
7. **Match team resolution**: `match.getTeam()` is available on our match (passed as prop). Use `team.frenoy.divisionId` and `team.competition` for filtering.

## Implementation Plan

### Tasks

- [ ] Task 1: Add locale string for "Afdeling" button
  - File: `src/utils/locales-nl.ts`
  - Action: Add `division: "Afdeling"` to the `match.tabs` section (after line 354, near other button labels)

- [ ] Task 2: Add `onFullView` callback prop to `OtherMatchPlayerResults`
  - File: `src/components/matches/Match/OtherMatchPlayerResults.tsx`
  - Action: Add optional `onFullView?: (match: IMatch) => void` prop. When provided, the "Volledig wedstrijdblad bekijken" button calls `onFullView(match)` instead of toggling `fullView` state internally. When not provided, existing inline toggle behavior is preserved (backwards compatible).
    ```typescript
    // Updated props:
    type OtherMatchPlayerResultsProps = { match: IMatch; onFullView?: (match: IMatch) => void };

    // In SwitchButton onClick:
    onClick={() => onFullView ? onFullView(match) : setFullView(!fullView)}
    ```
    This keeps the existing week page behavior unchanged while allowing the vandaag card to intercept.

- [ ] Task 3: Create `DivisionMatchesSection` component
  - File: `src/components/matches/MobileLiveMatches/DivisionMatchesSection.tsx` (new)
  - Action: Create a component that renders an inline table of today's division matches with expandable player details + a fullscreen modal for full wedstrijdblad.
  - Props: `{ match: IMatch }` (our match, used to determine division)
  - Implementation:
    1. **Select readonly matches**: `useTtcSelector(selectReadOnlyMatches)` and filter:
       ```typescript
       const team = match.getTeam();
       const todayDivisionMatches = readonlyMatches
         .filter(m => m.competition === (team.competition === 'Sporta' ? 'Sporta' : 'Vttl'))
         .filter(m => m.frenoyDivisionId === team.frenoy.divisionId)
         .filter(m => m.shouldBePlayed && m.isBeingPlayed())
         .filter(m => !m.isOurMatch);
       ```
    2. **Inline table**: `<Table size="sm" striped>` with clickable rows for each match:
       - Columns: Home team name | Score | Away team name
       - Reuse `OtherMatchTeamTitle` for team names (shows club name + team code + position)
       - Reuse `OpponentMatchScore` for score display
       - Clickable rows: toggle `showMatch[matchId]` state (same pattern as `OpponentMatches`)
    3. **Inline expand**: Below each row, render `<OtherMatchPlayerResultsTableRow>` with `show={showMatch[matchId]}`. Pass `onFullView` callback to intercept "Volledig wedstrijdblad" click.
       - `OtherMatchPlayerResults` shows compact two-column player view with win counts
       - "Volledig wedstrijdblad bekijken" button triggers `onFullView` -> sets `modalMatch` state
    4. **Fullscreen modal**: When `modalMatch` is set, open a fullscreen `<Modal>` containing:
       - Header: "{home team} vs {away team}" with close button
       - Body: `<ReadonlyIndividualMatches match={modalMatch} />`
    5. **Auto-sync interval**: `useEffect` with `setInterval` every 10 minutes:
       ```typescript
       useEffect(() => {
         const interval = setInterval(() => {
           todayDivisionMatches.forEach(m => dispatch(frenoyReadOnlyMatchSync(m)));
         }, 10 * 60 * 1000);
         return () => clearInterval(interval);
       }, [todayDivisionMatches, dispatch]);
       ```
    6. **Match count for parent**: Compute `todayDivisionMatches` in `MatchActionButtons` directly and conditionally render button + section

- [ ] Task 4: Integrate "Afdeling" button into `MatchActionButtons`
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx`
  - Action:
    1. Add state: `const [showDivision, setShowDivision] = useState(false);`
    2. Add selector: `const readonlyMatches = useTtcSelector(selectReadOnlyMatches);`
    3. Compute today's division matches (same filter as Task 2):
       ```typescript
       const team = match.getTeam();
       const todayDivisionMatches = readonlyMatches
         .filter(m => m.competition === (team.competition === 'Sporta' ? 'Sporta' : 'Vttl'))
         .filter(m => m.frenoyDivisionId === team.frenoy.divisionId)
         .filter(m => m.shouldBePlayed && m.isBeingPlayed())
         .filter(m => !m.isOurMatch);
       ```
    4. Add "Afdeling" button to `<ButtonGroup>` (after the existing buttons, before the admin button):
       ```tsx
       {todayDivisionMatches.length > 0 && (
         <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.division')}</Tooltip>}>
           <Button
             variant={showDivision ? 'secondary' : 'outline-secondary'}
             onClick={() => setShowDivision(!showDivision)}
           >
             {t('match.tabs.division')}
           </Button>
         </OverlayTrigger>
       )}
       ```
    5. Add collapsible section below the ButtonGroup `<div>` (after line 173, next to `showGames` section):
       ```tsx
       {showDivision && (
         <div style={{ marginTop: 12, marginBottom: 8 }}>
           <DivisionMatchesSection match={match} />
         </div>
       )}
       ```
    6. Add imports: `selectReadOnlyMatches` from storeHooks, `DivisionMatchesSection` from new file

- [ ] Task 5: Write tests for `DivisionMatchesSection`
  - File: `src/components/matches/MobileLiveMatches/spec/DivisionMatchesSectionSpec.tsx` (new)
  - Action: Test the new component:
    - Mock `storeUtil` with `getTeam` returning a team with `frenoy.divisionId` and `competition`
    - Preload store with `readonlyMatches` containing:
      - 2 matches in same division, today (isBeingPlayed), not our match
      - 1 match in different division (should be filtered out)
      - 1 match that is our match (should be filtered out)
    - Tests:
      1. Renders table with today's division matches (excluding our match)
      2. Does not render matches from other divisions
      3. Clicking a match row expands inline player details (compact two-column view)
      4. Clicking "Volledig wedstrijdblad bekijken" in expanded row opens fullscreen modal with `ReadonlyIndividualMatches`
      5. Modal closes when close button is clicked
      6. Does not render matches that are not being played today

- [ ] Task 6: Write tests for "Afdeling" button in `MatchActionButtons`
  - File: `src/components/matches/MobileLiveMatches/spec/MatchActionButtonsSpec.tsx` (new)
  - Action: Test the button visibility:
    - Tests:
      1. "Afdeling" button is shown when today's division matches exist
      2. "Afdeling" button is hidden when no today's division matches exist
      3. Clicking "Afdeling" button toggles the division section

- [ ] Task 7: Run tests and lint
  - Action: Run `npm test` and `npm run lint` to verify all changes pass

### Acceptance Criteria

- [ ] AC1: Given a vandaag card for a match whose division has other matches being played today, when the card renders, then an "Afdeling" button is visible in the button row
- [ ] AC2: Given a vandaag card for a match whose division has NO other matches today, when the card renders, then no "Afdeling" button is shown
- [ ] AC3: Given the "Afdeling" button is visible, when the user clicks it, then an inline section expands below the button row showing a table of today's division matches (home team, score, away team)
- [ ] AC4: Given the division matches section is expanded, when the user clicks a match row that has been synced with Frenoy, then the row expands inline showing compact player details (two columns: home/away players with win counts)
- [ ] AC5: Given an expanded match row showing player details, when the user clicks "Volledig wedstrijdblad bekijken", then a fullscreen modal opens showing `ReadonlyIndividualMatches` (full game-by-game results table)
- [ ] AC5b: Given the fullscreen modal is open, when the user clicks the close button, then the modal closes and the inline section remains visible
- [ ] AC6: Given the division matches section is expanded, when 10 minutes pass, then the readonly matches auto-resync with Frenoy (via `frenoyReadOnlyMatchSync`) and scores update inline
- [ ] AC7: Given the "Afdeling" button is toggled on, when the user clicks it again, then the division section collapses (same toggle pattern as "Individueel" button)
- [ ] AC8: Given a match row that is NOT synced with Frenoy, when the user sees it, then no score is displayed (consistent with `OpponentMatchScore` behavior: returns null for unsynced matches)
- [ ] AC9: Given our own match is also in the readonly matches store, when the division section renders, then our match is excluded from the list (filtered by `!isOurMatch`)
- [ ] AC10: Given two vandaag cards from different divisions (e.g. Vttl A and Sporta A), when each card's "Afdeling" button is clicked, then each card only shows matches from its own division

## Additional Context

### Dependencies

- No new npm packages needed
- No backend changes needed — `FrenoyMatchesApi` already has 10min in-memory rate limiting per match (`FrenoyNoPesterCache`) and per opponent team (`FrenoyOpponentCache`)
- `getOpponentMatches` endpoint already fetches division matches and triggers `frenoyReadOnlyMatchSync` for each
- `selectReadOnlyMatches` provides all readonly matches wrapped in `MatchModel` with `isBeingPlayed()` available
- Reused components: `OtherMatchTeamTitle`, `OpponentMatchScore`, `OtherMatchPlayerResults`, `ReadonlyIndividualMatches`

### Testing Strategy

**Unit tests** (2 new spec files):
- `DivisionMatchesSectionSpec.tsx`: Table rendering, division filtering, modal open/close, match exclusion
- `MatchActionButtonsSpec.tsx`: Button visibility based on division matches availability, toggle behavior

**Manual testing:**
- Open vandaag page during a match day with other division matches happening
- Verify "Afdeling" button appears on relevant cards
- Click to expand: verify match table with team names and scores
- Click a synced match row: verify fullscreen modal with individual results
- Toggle "Volledig wedstrijdblad" inside modal
- Wait 10 minutes (or mock): verify scores auto-update
- Check card with no other division matches: no "Afdeling" button
- Check multiple cards from different divisions: each shows only its division

### Notes

- `getOpponentMatches` dispatches without `opponent` param fetch ALL division matches (used in `TeamMatchesWeek`). The existing dispatch in `MatchActionButtons` (line 128) passes `opponent` — this fetches the specific opponent's matches. For the "Afdeling" feature, we need ALL division matches, so we should also dispatch `getOpponentMatches({ teamId: match.teamId })` without the opponent param to ensure all matches are loaded.
- The auto-sync `setInterval` should not use `forceSync` — just dispatch `frenoyReadOnlyMatchSync(match)` which respects `shouldSync()` (skips already-synced matches). The backend `FrenoyNoPesterCache` provides the actual rate limiting.
- `OtherMatchTeamTitle` component needs the `team` prop (ITeam) — get it from `match.getTeam()`.
- When the division section is shown but matches haven't loaded yet (first render), the table may be empty. The `getOpponentMatches` useEffect in `MatchActionButtons` already triggers the fetch — matches will appear once the thunk resolves. Could optionally show a spinner during loading.
- The `isBeingPlayed()` check uses `±14 hours` from now, which is generous enough to catch all matches on a match day (matches typically start between 14:00-20:00).
- Future consideration: if the same division match appears in multiple cards (e.g., two of our teams in the same division), the auto-sync intervals would overlap. This is harmless — backend rate limiting prevents duplicate Frenoy calls.
