import React from 'react';

import OpponentPlayer from './OpponentPlayer.js';
import OwnPlayer from './OwnPlayer.js';

const MatchPlayers = ({match, team, t}) => (
  <div className="match-card-tab-content">
    <div>
      <h3>{t('match.playersVictoryTitle')}</h3>
      {match.getOwnPlayers().map(ply => (
        <OwnPlayer match={match} ply={ply} team={team} key={ply.position} />
      ))}
    </div>
    <div>
      <h3>{t('match.playersOpponentsTitle')}</h3>
      {match.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} />)}
    </div>
  </div>
);

export default MatchPlayers;