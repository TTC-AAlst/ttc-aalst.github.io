import React from 'react';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchHeader } from './MobileLiveMatchHeader';
import { MobileLiveMatchInProgress } from './MobileLiveMatchInProgress';

type MobileLiveMatchCardProps = {
  match: IMatch;
};

export const MobileLiveMatchCard = ({ match }: MobileLiveMatchCardProps) => {
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
      <MobileLiveMatchInProgress match={match} />
    </div>
  );
};
