import React from 'react';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchCard } from './MobileLiveMatchCard';
import { useViewport } from '../../../utils/hooks/useViewport';

type MobileLiveMatchesProps = {
  matches: IMatch[];
};

export const MobileLiveMatches = ({ matches }: MobileLiveMatchesProps) => {
  const viewport = useViewport();
  const isMobile = viewport.width < 992;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 16,
        paddingTop: 10,
      }}
    >
      {matches.map(match => (
        <MobileLiveMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};
