---
title: 'Collapsed vandaag card mini body with player names'
slug: 'collapsed-card-player-names'
created: '2026-02-21'
status: 'done'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['React 18', 'TypeScript', 'Redux Toolkit', 'react-bootstrap', 'vitest', 'react-testing-library']
files_to_modify:
  - 'src/components/matches/MobileLiveMatches/MobileLiveMatchCard.tsx'
  - 'src/utils/locales-nl.ts (if needed)'
code_patterns:
  - 'MobileLiveMatchCard: showContent = !isCollapsible || expanded (line 16)'
  - 'Collapsed state shows only MobileLiveMatchHeader + chevron button'
  - 'Expanded state adds MobileLiveMatchInProgress below header'
  - 'match.getPlayerFormation("onlyFinal") returns IMatchPlayerInfo[] for pre-match formation'
  - 'match.getOwnPlayers().filter(ply => ply.status === match.block) for during-match players'
  - 'getRankingResults(match, ply) computes wins/losses from game results'
  - 'IMatchPlayer has: alias, ranking, uniqueIndex, playerId, status, won'
  - 'IMatchPlayerInfo has: player (IPlayer), matchPlayer (IMatchPlayer)'
  - 'Player ranking: ply.ranking on IMatchPlayer, or player.vttl?.ranking / player.sporta?.ranking on IPlayer'
  - 'storeUtil.getPlayer(playerId) resolves IPlayer from store'
test_patterns:
  - 'No existing tests for MobileLiveMatchCard'
  - 'spec/*Spec.tsx files in sibling spec/ directory'
  - 'renderWithProviders from utils/test-utils.tsx'
  - 'vi.mock for storeUtil and httpClient'
  - 'vitest + @testing-library/react'
---

# Tech-Spec: Collapsed vandaag card mini body with player names

**Created:** 2026-02-21

## Overview

### Problem Statement

When vandaag cards are collapsed on mobile (multiple matches), only the header is visible (team names + score). There's no information about who's playing or how individual players are doing without expanding the card.

### Solution

Add a compact mini body below the header when collapsed, showing our players as small inline text with name, ranking, and win count (when games have been played). Only shown when a formation is confirmed.

Examples:
- Pre-match: `Wouter B2 · Jan B6 · Pieter C2 · Karel C4`
- During match: `Wouter B2 (3) · Jan B6 (2) · Pieter C2 (1) · Karel C4 (0)`
- No formation: no mini body shown

### Scope

**In Scope:**
- Mini body section in `MobileLiveMatchCard` when collapsed, between header and the collapse chevron
- Shows confirmed formation players with alias + ranking
- During/after match: append win count in parentheses
- No formation confirmed = no mini body (collapsed state unchanged)
- Same player source as expanded card

**Out of Scope:**
- Changes to expanded state
- Changes to header styling
- Opponent player names
- Badge/chip styling (plain text only)

## Context for Development

### Codebase Patterns

**MobileLiveMatchCard structure (`MobileLiveMatchCard.tsx:15-57`):**
- `showContent = !isCollapsible || expanded` (line 16) controls whether `MobileLiveMatchInProgress` renders
- Collapsed state: only `MobileLiveMatchHeader` + chevron button (inside a `position: relative` div)
- The mini body should render between the header wrapper and the `MobileLiveMatchInProgress` — visible when collapsed, potentially also when expanded (formation is always useful context)

**Player data access — two modes:**
1. **Pre-match** (no `hasPlayersOrGames`): `match.getPlayerFormation('onlyFinal')` returns `IMatchPlayerInfo[]` with `.player` (IPlayer) and `.matchPlayer` (IMatchPlayer). Returns empty array if no formation confirmed.
2. **During match** (has players/games): `match.getOwnPlayers().filter(ply => ply.status === match.block)` returns `IMatchPlayer[]`. Each has `.alias`, `.ranking`, `.uniqueIndex`.

**Win count computation:**
- `getRankingResults(match, ply)` from `OwnPlayer.tsx:81-99` — returns `{ win: PlayerRanking[], lost: PlayerRanking[], wo: boolean }`
- `result.win.length` = number of individual games won
- For the mini body, just need the count: `result.win.length`

**Ranking access:**
- `IMatchPlayer.ranking` — directly available on match player (e.g. `"B2"`)
- `player.vttl?.ranking` / `player.sporta?.ranking` on `IPlayer` — same value, different access path
- For collapsed view, `IMatchPlayer.ranking` is simplest (available in both modes after resolving)

**Determining which mode:**
- `match.games.length > 0 || match.getTheirPlayers().length > 0` = has started / in progress
- `match.getPlayerFormation('onlyFinal').length > 0` = has confirmed formation (pre-match)
- If neither: no mini body

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/matches/MobileLiveMatches/MobileLiveMatchCard.tsx` | Card component with collapsed/expanded logic (line 15-57). Main file to modify. |
| `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx` | `FormationsWithResults` (line 62) and `OurFormationPreStart` (line 261) — reference for player data access patterns |
| `src/components/matches/Match/OwnPlayer.tsx` | `getRankingResults()` (line 81) for win count computation, ranking access patterns |
| `src/models/MatchModel.ts` | `getPlayerFormation('onlyFinal')` (line 226), `getOwnPlayers()` (line 280), `getTeamPlayerCount()` |
| `src/models/model-interfaces.ts` | `IMatchPlayer` (alias, ranking, status), `IMatchPlayerInfo` (player + matchPlayer) |
| `src/storeUtil.ts` | `storeUtil.getPlayer(playerId)` to resolve IPlayer from IMatchPlayer |

### Technical Decisions

1. **Render mini body in `MobileLiveMatchCard`** — add a new `CollapsedPlayerSummary` component between the header wrapper and `MobileLiveMatchInProgress`. Show it when `isCollapsible && !expanded` (only in collapsed state).
2. **Unified player resolution**: In both modes, resolve to a common shape `{ alias: string, ranking: string, wins?: number }[]`:
   - Pre-match: from `getPlayerFormation('onlyFinal')` — `matchPlayer.alias`, `matchPlayer.ranking`
   - During match: from `getOwnPlayers().filter(status === block)` — `ply.alias`, `ply.ranking`, `getRankingResults(match, ply).win.length`
3. **Export `getRankingResults`** from `OwnPlayer.tsx` (currently not exported) so `CollapsedPlayerSummary` can use it. Or duplicate the simple win count logic inline (just count games where `ownPlayer === ply` and `outcome === Won`).
4. **Styling**: Small font (`0.8em`), muted color (`#666`), centered, with `·` separator. Padding `4px 8px`. No links, no badges — plain text only.
5. **No mini body when empty**: If `getPlayerFormation('onlyFinal')` returns empty (pre-match, no formation) AND `getOwnPlayers().filter(status === block)` is empty (no locked-in players), don't render anything.

## Implementation Plan

### Tasks

- [ ] Task 1: Export `getRankingResults` from `OwnPlayer.tsx`
  - File: `src/components/matches/Match/OwnPlayer.tsx`
  - Action: Add `export` to the `getRankingResults` function (line 81). Currently it's a module-private function. The `RankingResult` type (line 75) also needs to be exported.
  - Note: This is a non-breaking change — existing usage within the file is unaffected.

- [ ] Task 2: Create `CollapsedPlayerSummary` component
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatchCard.tsx` (inline in same file, or new file if complex)
  - Action: Create a component with props `{ match: IMatch }` that renders the mini body:
    1. **Determine players**:
       ```typescript
       const hasPlayersOrGames = match.games.length > 0 || match.getTheirPlayers().length > 0;
       ```
       - If `hasPlayersOrGames`: use `match.getOwnPlayers().filter(ply => ply.status === match.block)`
       - Else: use `match.getPlayerFormation('onlyFinal')` and map to `IMatchPlayer` via `.matchPlayer`
    2. **If no players**: return `null`
    3. **Render**: For each player, show:
       - `ply.alias` (short name)
       - `ply.ranking` (competition ranking, e.g. "B2")
       - If `hasPlayersOrGames` and match has games: append `(N)` where N = `getRankingResults(match, ply).win.length`
       - Separate players with ` · ` (middle dot)
    4. **Styling**:
       ```tsx
       <div style={{ padding: '4px 8px', fontSize: '0.8em', color: '#666', textAlign: 'center' }}>
         {players.map((ply, i) => (
           <span key={ply.uniqueIndex || i}>
             {i > 0 && ' · '}
             {ply.alias} {ply.ranking}
             {hasGames && ` (${wins})`}
           </span>
         ))}
       </div>
       ```

- [ ] Task 3: Integrate `CollapsedPlayerSummary` into `MobileLiveMatchCard`
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatchCard.tsx`
  - Action: Add the mini body between the header wrapper `</div>` (line 53) and the `showContent` conditional (line 54):
    ```tsx
    {isCollapsible && !expanded && <CollapsedPlayerSummary match={match} />}
    {showContent && <MobileLiveMatchInProgress match={match} />}
    ```
  - Import `getRankingResults` from `OwnPlayer` if component is in this file, or from new file.

- [ ] Task 4: Write tests for `CollapsedPlayerSummary`
  - File: `src/components/matches/MobileLiveMatches/spec/CollapsedPlayerSummarySpec.tsx` (new)
  - Action: Test the component:
    - Mock `storeUtil` for `getPlayer` calls
    - Tests:
      1. Renders player names with rankings when formation is confirmed (pre-match)
      2. Renders player names with rankings and win counts when match has games
      3. Returns null when no formation is confirmed
      4. Uses `·` separator between players
      5. Shows `(0)` for players with no wins during match

- [ ] Task 5: Run tests and lint
  - Action: Run `npm test` and `npm run lint` to verify all changes pass

### Acceptance Criteria

- [ ] AC1: Given a collapsed vandaag card with a confirmed pre-match formation, when the card renders, then a mini body shows below the header with player aliases and rankings separated by `·` (e.g. "Wouter B2 · Jan B6 · Pieter C2 · Karel C4")
- [ ] AC2: Given a collapsed vandaag card with a match in progress, when the card renders, then the mini body shows player aliases, rankings, and win counts (e.g. "Wouter B2 (3) · Jan B6 (2) · Pieter C2 (1) · Karel C4 (0)")
- [ ] AC3: Given a collapsed vandaag card with no confirmed formation, when the card renders, then no mini body is shown (only the header)
- [ ] AC4: Given a vandaag card that is expanded, when the card renders, then the mini body is NOT shown (full content is visible instead)
- [ ] AC5: Given a single vandaag card (not collapsible), when the card renders, then no mini body is shown (cards are always expanded when not collapsible)
- [ ] AC6: Given a match where a player has a walkover, when the collapsed mini body renders, then the player is still listed with their ranking (no strikethrough in mini view)
- [ ] AC7: Given a collapsed card with a synced match (all results in), when the card renders, then final win counts are shown for each player

## Additional Context

### Dependencies

- No new npm packages needed
- No backend changes needed
- `getRankingResults` needs to be exported from `OwnPlayer.tsx` (Task 1)
- `storeUtil.getPlayer()` needed if using `getPlayerFormation('onlyFinal')` path (returns `IMatchPlayerInfo` with `.matchPlayer` that has ranking)

### Testing Strategy

**Unit tests** (1 new spec file):
- `CollapsedPlayerSummarySpec.tsx`: Pre-match rendering, during-match rendering with wins, no-formation case, separator character

**Manual testing:**
- Open vandaag page on mobile with multiple matches (triggers collapse)
- Verify collapsed cards show player names + rankings
- Start a match, enter some scores — verify win counts appear
- Test with match that has no formation — verify no mini body
- Test with single match (not collapsible) — verify no mini body

### Notes

- The mini body uses `ply.alias` (short name) not `ply.name` (full name) to keep it compact on mobile
- `ply.ranking` on `IMatchPlayer` is the ranking string (e.g. "B2") — same value as `player.vttl?.ranking`, just accessed directly
- `getRankingResults` is currently not exported from `OwnPlayer.tsx` — Task 1 adds the export. Alternative: inline a simpler win count computation, but reusing the existing function is cleaner and consistent.
- The mini body only shows in collapsed state (`isCollapsible && !expanded`). When expanded, the full `MobileLiveMatchInProgress` shows the same information in richer detail.
- Edge case: if `match.block` is empty and match has started but no players are locked in, the mini body won't show (filter returns empty array). This matches the expanded card behavior.
