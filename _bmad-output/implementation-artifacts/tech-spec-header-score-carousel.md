---
title: 'Header Score Carousel for Live Matches'
slug: 'header-score-carousel'
created: '2026-02-21'
status: 'done'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - React 19
  - TypeScript
  - MUI AppBar/Toolbar
  - dayjs
  - Redux Toolkit (createSelector)
  - react-router-dom v6
  - CSS transitions
files_to_modify:
  - src/components/skeleton/Header/Header.tsx
  - src/components/skeleton/Header/Header.css
files_to_create:
  - src/components/skeleton/Header/HeaderScoreCarousel.tsx
code_patterns:
  - useTtcSelector for Redux state
  - selectMatchesBeingPlayed selector (already exists)
  - useViewport() for responsive logic
  - useLocation() for current route detection
  - t.route('matchesToday') returns '/vandaag'
  - Icon component with fa prop for FontAwesome
  - Match model: date (dayjs), score, isHomeMatch, competition, getTeam(), renderScore()
test_patterns:
  - Test files: **/spec/**/*Spec.tsx
  - Framework: vitest with happy-dom
  - No existing Header tests
---

# Tech-Spec: Header Score Carousel for Live Matches

**Created:** 2026-02-21

## Overview

### Problem Statement

Users cannot see live match scores at a glance when browsing pages other than `/vandaag`. They must navigate to the dedicated page to check how matches are progressing.

### Solution

Replace the club name in the header with an auto-rotating score ticker when matches are being played today. The carousel displays each match's score (or start time if not started), cycles through with a slide-up animation every ~3 seconds, and clicking it navigates to `/vandaag`.

### Scope

**In Scope:**
- New `HeaderScoreCarousel` component
- Slide-up animation (~3 second interval) using CSS transitions
- Display format: "Vttl A: 8-6" or "Sporta B: 19:45" (start time if not started)
- Responsive: show opponent name if space allows (e.g., "Vttl A vs Opponent: 8-6")
- Home icon indicator for home matches
- Click anywhere on carousel → navigate to `/vandaag`
- Hide carousel on `/vandaag` page itself (show club name instead)

**Out of Scope:**
- Manual navigation controls (dots, arrows)
- Pause on hover
- Persist carousel position across page navigations
- Click to specific match (only to /vandaag)

## Context for Development

### Codebase Patterns

- Header uses MUI `AppBar` with `dense` Toolbar variant
- Redux state accessed via `useTtcSelector` hook
- Today's matches available via `selectMatchesBeingPlayed` selector
- Match model has `date` (dayjs), `score`, `isHomeMatch`, `competition`, `getTeam()`
- Routes use `t.route('matchesToday')` which maps to `/vandaag`
- Responsive checks via `useViewport()` hook

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/skeleton/Header/Header.tsx` | Main header component to modify |
| `src/components/skeleton/Header/Header.css` | Header styles (add carousel animations) |
| `src/components/skeleton/Header/HeaderNavigation.tsx` | Example of using `selectMatchesBeingPlayed` in header |
| `src/components/matches/MatchScore.tsx` | Score display patterns (colors, formatting) |
| `src/components/matches/MobileLiveMatches/MobileLiveMatchHeader.tsx` | Match display with team names, home/away logic |
| `src/utils/hooks/storeHooks.ts` | Redux hooks, `selectMatchesBeingPlayed` selector |
| `src/models/MatchModel.ts` | Match model: `isBeingPlayed()`, `getTeam()`, `renderScore()` |
| `src/components/controls/Icons/Icon.tsx` | Icon component for home indicator |

### Technical Decisions

1. **CSS transitions over animation library**: No new dependencies; use `transform: translateY()` with CSS `transition` property
2. **Interval-based rotation**: `useEffect` with `setInterval` (~3000ms) to cycle through matches
3. **Responsive text**: Use `useViewport()` to determine if opponent name fits (threshold ~400px)
4. **Home indicator**: FontAwesome home icon (`fa fa-home`) for home matches
5. **Route detection**: Use `useLocation()` from react-router-dom; compare `pathname` with `t.route('matchesToday')` to hide on /vandaag
6. **Score vs Time**: Check `match.score.home === 0 && match.score.out === 0` → show `match.date.format('HH:mm')` for start time
7. **Team display format**: Use `match.competition` + `match.getTeam().teamCode` (e.g., "Vttl A")

## Implementation Plan

### Tasks

- [ ] **Task 1: Create HeaderScoreCarousel component**
  - File: `src/components/skeleton/Header/HeaderScoreCarousel.tsx` (new)
  - Action: Create new component with the following:
    - Props: `matches: IMatch[]`
    - State: `currentIndex` (number) for tracking which match to display
    - `useEffect` with `setInterval(3000)` to cycle `currentIndex` through matches
    - Cleanup interval on unmount
    - Wrap entire component in `<Link to={t.route('matchesToday')}>` for navigation
    - Use `useViewport()` to determine responsive display
  - Display logic per match:
    - If `match.score.home === 0 && match.score.out === 0`: show start time (`match.date.format('HH:mm')`)
    - Else: show score (`match.score.home - match.score.out`)
    - Team format: `{match.competition} {match.getTeam().teamCode}` (e.g., "Vttl A")
    - If `viewport.width > 400` and opponent exists: append ` vs {opponent.clubName}` (shortened)
    - If `match.isHomeMatch`: prepend home icon (`<Icon fa="fa fa-home" />`)
  - Animation structure:
    - Outer container: fixed height (~24px), `overflow: hidden`
    - Inner container: holds all match items stacked vertically
    - Apply `transform: translateY(-${currentIndex * itemHeight}px)` with CSS transition

- [ ] **Task 2: Add carousel CSS styles**
  - File: `src/components/skeleton/Header/Header.css`
  - Action: Add styles for carousel animation:
    ```css
    .Header-carousel {
      height: 24px;
      overflow: hidden;
      cursor: pointer;
    }
    .Header-carousel-inner {
      transition: transform 0.4s ease-in-out;
    }
    .Header-carousel-item {
      height: 24px;
      display: flex;
      align-items: center;
      color: var(--brand-color);
      font-size: 1em;
      white-space: nowrap;
    }
    .Header-carousel-item .fa-home {
      margin-right: 6px;
      font-size: 0.85em;
    }
    ```

- [ ] **Task 3: Integrate carousel into Header**
  - File: `src/components/skeleton/Header/Header.tsx`
  - Action:
    - Import `useLocation` from `react-router-dom`
    - Import `selectMatchesBeingPlayed` from storeHooks
    - Import `HeaderScoreCarousel` component
    - Import `t` from locales (if not already)
    - Get current location: `const location = useLocation()`
    - Get matches: `const matchesToday = useTtcSelector(selectMatchesBeingPlayed)`
    - Determine if on /vandaag: `const isOnVandaag = location.pathname === t.route('matchesToday')`
    - In the Typography element (club name area):
      - If `matchesToday.length > 0 && !isOnVandaag`: render `<HeaderScoreCarousel matches={matchesToday} />`
      - Else: render existing club name link

### Acceptance Criteria

- [ ] **AC 1**: Given matches are being played today and user is NOT on `/vandaag`, when the header renders, then the carousel is visible instead of the club name
- [ ] **AC 2**: Given matches are being played today and user IS on `/vandaag`, when the header renders, then the club name is shown (not the carousel)
- [ ] **AC 3**: Given no matches are being played today, when the header renders, then the club name is shown
- [ ] **AC 4**: Given a match has not started (score 0-0), when displayed in carousel, then the start time is shown (e.g., "Vttl A: 19:45")
- [ ] **AC 5**: Given a match has a score, when displayed in carousel, then the score is shown (e.g., "Sporta B: 8-6")
- [ ] **AC 6**: Given a home match, when displayed in carousel, then a home icon appears before the team name
- [ ] **AC 7**: Given multiple matches today, when 3 seconds pass, then the carousel slides up to show the next match
- [ ] **AC 8**: Given the carousel is displaying the last match, when 3 seconds pass, then it loops back to the first match
- [ ] **AC 9**: Given the carousel is clicked, when user taps/clicks it, then they are navigated to `/vandaag`
- [ ] **AC 10**: Given viewport width > 400px, when displaying a match, then opponent name is included (e.g., "Vttl A vs Opponent: 8-6")

## Additional Context

### Dependencies

- No new npm dependencies required
- Uses existing: MUI, react-router-dom, dayjs, Redux

### Testing Strategy

**Unit Tests** (optional - no existing Header tests):
- `HeaderScoreCarousel` component:
  - Renders match score when score exists
  - Renders start time when score is 0-0
  - Shows home icon for home matches
  - Cycles through matches (mock timers)

**Manual Testing:**
1. With matches being played:
   - Navigate to homepage → verify carousel shows instead of club name
   - Wait 3+ seconds → verify carousel slides to next match
   - Click carousel → verify navigation to `/vandaag`
   - Navigate to `/vandaag` → verify club name shows (not carousel)
2. Without matches being played:
   - Verify club name shows on all pages
3. Responsive:
   - Narrow viewport (< 400px) → verify short format ("Vttl A: 8-6")
   - Wide viewport (> 400px) → verify opponent included ("Vttl A vs Opponent: 8-6")

### Notes

- GitHub Issue: #239
- Animation should feel "sportsy" - like a live sports ticker
- Carousel replaces club name area; hamburger menu and nav buttons remain unchanged
- The `selectMatchesBeingPlayed` selector already filters out walkover matches and forfaits
- Consider: if only 1 match, no animation needed (static display)
- Future enhancement: pause animation when tab is not visible (reduces CPU)
