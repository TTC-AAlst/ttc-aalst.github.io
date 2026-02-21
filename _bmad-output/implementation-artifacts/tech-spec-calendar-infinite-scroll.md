---
title: 'Calendar Infinite Scrolling'
slug: 'calendar-infinite-scroll'
created: '2026-02-21'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - React 19
  - TypeScript
  - CSS (position: sticky)
files_to_modify:
  - src/components/matches/MatchesWeek.tsx
  - src/components/matches/MatchesWeeks/WeekTitle.tsx
code_patterns:
  - WeekCalcer.weeks array contains all weeks
  - WeekCalcer.getMatches() filters by current week - needs change to get all
  - scrollIntoView for initial positioning
  - position: sticky for filter bar
test_patterns:
  - Manual testing
---

# Tech-Spec: Calendar Infinite Scrolling

**Created:** 2026-02-21

## Overview

### Problem Statement

The calendar page (`/kalender`) currently shows one week at a time with prev/next arrows. Users must click repeatedly to browse through the season, which is tedious.

### Solution

Render all weeks in a single scrollable view. On page load, automatically scroll to the current week. The competition filter buttons become sticky below the header so users can always switch between Vttl/Sporta/All.

### Scope

**In Scope:**
- Render all weeks vertically stacked
- Auto-scroll to current week on mount
- Sticky competition filter bar
- Remove prev/next navigation arrows
- Each week has a header showing week number and date range

**Out of Scope:**
- Virtual scrolling (not needed for ~22 weeks)
- Lazy loading weeks (all data already in Redux)
- URL updates as user scrolls (keep simple)

## Context for Development

### Codebase Patterns

- `WeekCalcer` already calculates all weeks in `this.weeks` array
- `WeekCalcer.getMatches()` filters to current week - need to get matches per week
- `WeekTitle` currently shows prev/next arrows - will be simplified to just show week header
- MUI AppBar is already `position: sticky` at top (~48px height)

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/matches/MatchesWeek.tsx` | Main component to refactor |
| `src/components/matches/MatchesWeeks/WeekTitle.tsx` | Simplify to header-only (no arrows) |
| `src/components/matches/MatchesWeeks/WeekCalcer.ts` | Add method to get matches for specific week |

### Technical Decisions

1. **Render all at once**: ~22 weeks is not heavy, avoids lazy loading complexity
2. **scrollIntoView**: Use `useEffect` + `useRef` to scroll current week into view on mount
3. **Sticky filter bar**: `position: sticky; top: 48px` (below AppBar)
4. **Week refs**: Create ref for each week, use current week's ref for scrollIntoView

## Implementation Plan

### Tasks

- [ ] **Task 1: Add getMatchesForWeek method to WeekCalcer**
  - File: `src/components/matches/MatchesWeeks/WeekCalcer.ts`
  - Action: Add method to get matches for a specific week index:
    ```typescript
    getMatchesForWeek(weekIndex: number): IMatch[] {
      const week = this.weeks[weekIndex];
      if (!week) return [];
      return this.matches.filter(match =>
        match.date.isBetween(week.start, week.end, undefined, '[]')
      );
    }
    ```

- [ ] **Task 2: Simplify WeekTitle to header-only**
  - File: `src/components/matches/MatchesWeeks/WeekTitle.tsx`
  - Action:
    - Remove `weekChange` prop and arrow icons
    - Keep just the week number and date range display
    - Add `weekIndex` prop to show specific week (not just currentWeek)
    - New signature: `WeekTitle({ weekCalcer, weekIndex, style })`

- [ ] **Task 3: Refactor MatchesWeek for infinite scroll**
  - File: `src/components/matches/MatchesWeek.tsx`
  - Action:
    - Remove `currentWeek` state and `onChangeWeek` function
    - Create refs map for each week: `const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map())`
    - Render all weeks using `weekCalcer.weeks.map((week, index) => ...)`
    - For each week, render:
      - `<div ref={el => weekRefs.current.set(index, el)}>`
      - `<WeekTitle weekCalcer={weekCalcer} weekIndex={index} />`
      - `<MatchesWeekPerCompetition>` for each competition
    - Add useEffect to scroll current week into view on mount:
      ```typescript
      useEffect(() => {
        const currentWeekEl = weekRefs.current.get(weekCalcer.currentWeek - 1);
        currentWeekEl?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, []);
      ```

- [ ] **Task 4: Make competition filter sticky**
  - File: `src/components/matches/MatchesWeek.tsx`
  - Action:
    - Wrap the ButtonStack filter in a sticky container:
      ```tsx
      <div style={{
        position: 'sticky',
        top: 48,  // Below AppBar
        backgroundColor: 'white',
        zIndex: 100,
        padding: '8px 0',
        borderBottom: '1px solid #eee',
      }}>
        <ButtonStack ... />
      </div>
      ```
    - Remove the week-specific email button (or move to per-week header if needed)

- [ ] **Task 5: Update URL handling**
  - File: `src/components/matches/MatchesWeek.tsx`
  - Action:
    - Keep the `:comp` URL param for competition filter
    - Remove `:week` URL param (no longer needed)
    - Update route in `routes.tsx` if needed: `matchesWeek/:comp?`

### Acceptance Criteria

- [ ] **AC 1**: Given user navigates to /kalender, when page loads, then all weeks are visible in a scrollable list
- [ ] **AC 2**: Given user navigates to /kalender, when page loads, then the current week is scrolled into view
- [ ] **AC 3**: Given user is scrolling through weeks, when they look at header area, then competition filter buttons are always visible (sticky)
- [ ] **AC 4**: Given user clicks Vttl/Sporta filter, when filter changes, then all weeks update to show only that competition's matches
- [ ] **AC 5**: Given user scrolls up or down, when they scroll freely, then there are no loading states or jank
- [ ] **AC 6**: Given page loads, when viewing the layout, then prev/next arrows are no longer present

## Additional Context

### Dependencies

- No new npm dependencies

### Testing Strategy

**Manual Testing:**
1. Navigate to /kalender
2. Verify all weeks render and current week is in view
3. Scroll up/down freely - should be smooth
4. Verify sticky filter bar stays visible
5. Click Vttl/Sporta/All - verify filtering works across all weeks
6. Verify no prev/next arrows

### Notes

- GitHub Issue: #247
- Season has ~22 weeks, so rendering all is not a performance concern
- The edit mode for admins should still work (shows free matches)
- Consider: add visual indicator for "current week" (highlight or badge)
