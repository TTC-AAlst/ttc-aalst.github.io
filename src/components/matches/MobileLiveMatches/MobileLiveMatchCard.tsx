import React from 'react';
import moment from 'moment';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchHeader } from './MobileLiveMatchHeader';
import { MobileLiveMatchPreStart } from './MobileLiveMatchPreStart';
import { MobileLiveMatchInProgress } from './MobileLiveMatchInProgress';

type MobileLiveMatchCardProps = {
  match: IMatch;
};

export const MobileLiveMatchCard = ({ match }: MobileLiveMatchCardProps) => {
  const hasStarted = moment().isAfter(match.date);
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

      <div style={{ padding: 12 }}>
        {!hasStarted ? (
          <MobileLiveMatchPreStart match={match} />
        ) : (
          <MobileLiveMatchInProgress match={match} opponentPlayersKnown={opponentPlayersKnown} />
        )}
      </div>
    </div>
  );
};
