---
title: 'Add Logged-In Player VS Button to Vandaag'
slug: 'vandaag-vs-me-button'
created: '2026-02-21'
status: 'done'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - React 19
  - TypeScript
  - Redux Toolkit
  - React Bootstrap (Modal, Button)
files_to_modify:
  - src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx
code_patterns:
  - Existing getOpponentTeamEncounters thunk
  - Existing OpponentsFormation component with vs icons
  - Existing PreviousEncountersButtonModal for display
  - MatchActionButtons pattern for adding buttons
test_patterns:
  - Manual testing on /vandaag
---

# Tech-Spec: Add Logged-In Player VS Button to Vandaag

**Created:** 2026-02-21

## Overview

### Problem Statement

On `/vandaag`, logged-in users who want to see their personal encounter history against opponent players must navigate through the "Opponent" modal to find the vs icons. This is not discoverable and requires multiple clicks.

### Solution

Add a "vs me" button to the match card action buttons that directly shows the logged-in player's encounter history against the opponent team's players. Reuses existing `OpponentsFormation` component which already has vs icons per opponent.

### Scope

**In Scope:**
- Add "vs me" button to `MatchActionButtons` in `MobileLiveMatchInProgress.tsx`
- Open modal with `OpponentsFormation` filtered to show only the vs comparison
- Only show button when user is logged in
- Only show button when opponent players are known

**Out of Scope:**
- Changes to `OpponentsFormation` component itself
- New encounter fetching logic (reuse existing)
- Desktop-specific layouts

## Context for Development

### Codebase Patterns

- `MatchActionButtons` already has multiple buttons opening modals (report, opponents, encounters)
- `OpponentsFormation` component already shows vs icons when `currentPlayer` exists
- `getOpponentTeamEncounters` is already dispatched in `OpponentsFormation` useEffect
- Button uses `OverlayTrigger` + `Tooltip` pattern for accessibility

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx` | Add button to MatchActionButtons (line ~114-173) |
| `src/components/matches/Match/OpponentsFormation.tsx` | Reuse for vs display |
| `src/components/matches/Match/PreviousEncounters.tsx` | Reference for PreviousEncountersButtonModal |

### Technical Decisions

1. **Reuse OpponentsFormation**: It already has all the vs logic, just put it in a modal
2. **Button placement**: Add after "Previous Encounters" button, before admin button
3. **Icon**: Use `fa fa-user` or `fa fa-exchange` to indicate "vs me"
4. **Condition**: Only show when `user.playerId > 0` AND `hasTheirPlayers`

## Implementation Plan

### Tasks

- [ ] **Task 1: Add "vs me" button and modal to MatchActionButtons**
  - File: `src/components/matches/MobileLiveMatches/MobileLiveMatchInProgress.tsx`
  - Action:
    - Add state: `const [showVsMeModal, setShowVsMeModal] = useState(false)`
    - Add button after the "Previous Encounters" button (around line 166):
      ```tsx
      {hasTheirPlayers && user.playerId > 0 && (
        <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.vsMe')}</Tooltip>}>
          <Button variant="outline-secondary" onClick={() => setShowVsMeModal(true)}>
            <Icon fa="fa fa-exchange" />
          </Button>
        </OverlayTrigger>
      )}
      ```
    - Add modal (after the encounters modal, around line 222):
      ```tsx
      <Modal show={showVsMeModal} onHide={() => setShowVsMeModal(false)} fullscreen style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>{t('match.tabs.vsMe')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding: 6}}>
          <OpponentsFormation match={match} opponent={match.opponent} />
        </Modal.Body>
      </Modal>
      ```

- [ ] **Task 2: Add translation key**
  - File: `src/utils/locales-nl.ts`
  - Action: Add translation for the tooltip/title:
    ```typescript
    // In match.tabs section
    vsMe: 'Mijn duels',
    ```

### Acceptance Criteria

- [ ] **AC 1**: Given user is logged in and opponent players are known, when viewing match card on /vandaag, then "vs me" button is visible in action buttons
- [ ] **AC 2**: Given user is NOT logged in, when viewing match card, then "vs me" button is NOT shown
- [ ] **AC 3**: Given user clicks "vs me" button, when modal opens, then OpponentsFormation is shown with vs icons for each opponent
- [ ] **AC 4**: Given user clicks a vs icon in the modal, when encounters exist, then encounter history modal opens
- [ ] **AC 5**: Given opponent players are not yet known (pre-match), when viewing match card, then "vs me" button is NOT shown

## Additional Context

### Dependencies

- No new npm dependencies
- Reuses existing components and thunks

### Testing Strategy

**Manual Testing:**
1. Log in as a player
2. Go to /vandaag with a match that has opponent players entered
3. Verify "vs me" button appears in action buttons
4. Click it → modal opens with opponent list and vs icons
5. Click a vs icon → encounter history shows
6. Log out → verify button disappears

### Notes

- GitHub Issue: #243
- This is a small UX improvement using existing functionality
- The OpponentsFormation component auto-fetches encounters via useEffect when rendered
