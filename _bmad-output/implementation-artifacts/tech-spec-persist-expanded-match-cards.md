---
title: 'Persist Expanded Match Cards State'
slug: 'persist-expanded-match-cards'
created: '2026-02-21'
status: 'done'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - React 19
  - TypeScript
  - Redux Toolkit (createSlice)
files_to_modify:
  - src/reducers/configReducer.ts
  - src/components/matches/MobileLiveMatches/MobileLiveMatches.tsx
code_patterns:
  - configSlice with reducers pattern
  - useTtcSelector/useTtcDispatch hooks
  - Existing pattern: newMatchComments {[matchId]: boolean}
test_patterns:
  - Test files: **/spec/**/*Spec.tsx
  - Framework: vitest with happy-dom
---

# Tech-Spec: Persist Expanded Match Cards State

**Created:** 2026-02-21

## Overview

### Problem Statement

On mobile `/vandaag` page, when users expand match cards to see details and then navigate away and back, all cards reset to collapsed state. Users lose their context and must re-expand cards they were viewing.

### Solution

Store expanded match card IDs in Redux state (`configReducer`). When `MobileLiveMatches` renders, it reads the persisted state instead of starting with all cards collapsed. State persists during the session (until page refresh).

### Scope

**In Scope:**
- Add `expandedMatchCards: {[matchId: number]: boolean}` to configReducer
- Add `toggleMatchCardExpanded` action
- Update `MobileLiveMatches` to use Redux state instead of local state
- Initialize from Redux state on mount

**Out of Scope:**
- localStorage persistence (survives refresh) - just Redux for now
- Other pages (only `/vandaag`)
- Desktop behavior (cards are always expanded on desktop)

## Context for Development

### Codebase Patterns

- `configReducer` already has `newMatchComments: {[matchId: number]: boolean}` - same pattern
- `MobileLiveMatches` currently uses `useState<Set<number>>` for `expandedIds`
- Component checks `isCollapsible = isMobile && matches.length > 1` before using expand/collapse

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/reducers/configReducer.ts` | Add state and action (lines 61, 111-114 show similar pattern) |
| `src/components/matches/MobileLiveMatches/MobileLiveMatches.tsx` | Replace local state with Redux |

### Technical Decisions

1. **Redux over localStorage**: Simpler, fits existing patterns, session-scoped is sufficient
2. **Object over Set**: Redux requires serializable state; `{[matchId]: boolean}` works, `Set` doesn't
3. **Single action `toggleMatchCardExpanded`**: Takes matchId, flips the boolean (or sets true if undefined)

## Implementation Plan

### Tasks

- [ ] **Task 1: Add state and action to configReducer**
  - File: `src/reducers/configReducer.ts`
  - Action:
    - Add to `defaultConfigState`: `expandedMatchCards: {} as {[matchId: number]: boolean}`
    - Add reducer:
      ```typescript
      toggleMatchCardExpanded: (state, action: PayloadAction<number>) => {
        const matchId = action.payload;
        state.expandedMatchCards[matchId] = !state.expandedMatchCards[matchId];
      },
      ```
    - Export the action in the destructured exports at bottom

- [ ] **Task 2: Update MobileLiveMatches to use Redux**
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatches.tsx`
  - Action:
    - Import `toggleMatchCardExpanded` from configReducer
    - Replace `useState<Set<number>>` with selector:
      ```typescript
      const expandedMatchCards = useTtcSelector(state => state.config.expandedMatchCards);
      ```
    - Replace `expandedIds.has(matchId)` with `!!expandedMatchCards[matchId]`
    - Replace `toggleMatch` function:
      ```typescript
      const toggleMatch = (matchId: number) => {
        dispatch(toggleMatchCardExpanded(matchId));
      };
      ```
    - Update `toggleAll` to dispatch for each match:
      ```typescript
      const toggleAll = () => {
        const shouldExpand = !allExpanded;
        matches.forEach(m => {
          if (!!expandedMatchCards[m.id] !== shouldExpand) {
            dispatch(toggleMatchCardExpanded(m.id));
          }
        });
      };
      ```
    - Update `allExpanded` check: `matches.every(m => !!expandedMatchCards[m.id])`
    - Remove the `useState` for expandedIds entirely

### Acceptance Criteria

- [ ] **AC 1**: Given user is on `/vandaag` with multiple matches on mobile, when they expand a card and navigate to another page then back, then the card is still expanded
- [ ] **AC 2**: Given user expands multiple cards, when they use "collapse all" button, then all cards collapse
- [ ] **AC 3**: Given user collapses all cards, when they use "expand all" button, then all cards expand
- [ ] **AC 4**: Given user refreshes the page, when `/vandaag` loads, then cards start collapsed (Redux state resets)
- [ ] **AC 5**: Given user is on desktop (viewport > 992px), when viewing matches, then cards are always expanded (no change to existing behavior)

## Additional Context

### Dependencies

- No new npm dependencies
- Uses existing Redux Toolkit patterns

### Testing Strategy

**Manual Testing:**
1. On mobile viewport, go to `/vandaag` with multiple matches
2. Expand one card, navigate to `/spelers`, navigate back → card should still be expanded
3. Expand all, collapse all → buttons should work
4. Refresh page → cards should start collapsed

### Notes

- GitHub Issue: #238
- This is a small, focused change using existing patterns
- Future: could add localStorage for refresh persistence if users request it
