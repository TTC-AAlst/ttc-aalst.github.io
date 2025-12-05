import React from 'react';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchCard } from './MobileLiveMatchCard';

type MobileLiveMatchesProps = {
  matches: IMatch[];
};

export const MobileLiveMatches = ({ matches }: MobileLiveMatchesProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 10 }}>
    {matches.map(match => (
      <MobileLiveMatchCard key={match.id} match={match} />
    ))}
  </div>
);
