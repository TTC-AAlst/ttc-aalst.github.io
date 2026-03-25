import React from 'react';
import { MobileLiveMatches } from './MobileLiveMatches/MobileLiveMatches';
import { selectMatchesBeingPlayed, useTtcSelector } from '../../utils/hooks/storeHooks';

export const MatchesToday = () => {
  const matchesToday = useTtcSelector(selectMatchesBeingPlayed);
  if (matchesToday.length === 0) {
    return <div />;
  }

  return <MobileLiveMatches matches={matchesToday} />;
};
