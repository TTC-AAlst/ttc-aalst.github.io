import React from 'react';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchHeader } from './MobileLiveMatchHeader';
import { MobileLiveMatchInProgress } from './MobileLiveMatchInProgress';

type MobileLiveMatchCardProps = {
  match: IMatch;
};

export const MobileLiveMatchCard = ({ match }: MobileLiveMatchCardProps) => {
  const opponentPlayersKnown = match.getTheirPlayers().length > 0;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid #ddd',
        overflow: 'hidden',
      }}
    >
      <MobileLiveMatchHeader match={match} />
      <MobileLiveMatchInProgress match={match} opponentPlayersKnown={opponentPlayersKnown} />
    </div>
  );
};
