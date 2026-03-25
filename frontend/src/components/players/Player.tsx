import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {BackIcon} from '../controls/Icons/BackIcon';
import {PlayerCard} from './PlayerCard';
import {PlayerCompetition} from './Player/PlayerCompetition';
import {PlayerMatchHistory} from './Player/PlayerMatchHistory';
import { selectPlayers, useTtcSelector } from '../../utils/hooks/storeHooks';
import { useViewport } from '../../utils/hooks/useViewport';


export const Player = () => {
  const playerSlug = useParams().playerId;
  const players = useTtcSelector(selectPlayers);
  const player = players.find(x => x.slug === playerSlug);
  const viewport = useViewport();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!player) {
    return null;
  }

  return (
    <div style={{marginTop: 20, marginBottom: 10}}>
      <BackIcon className="d-none d-sm-inline" style={{position: 'absolute', right: 5, top: 80, zIndex: 99}} />
      <div className="row">
        <div className="col-md-12 col-lg-6">
          <PlayerCard player={player} showSideBySide={(viewport.width > 550 && viewport.width < 992) || viewport.width > 1200} />
        </div>
        <div className="col-md-6" style={{marginBottom: 8}}>
          <PlayerCompetition player={player} competition="Vttl" />
        </div>
        {viewport.width > 992 ? <div style={{clear: 'both'}} /> : null}
        <div className="col-md-6">
          <PlayerCompetition player={player} competition="Sporta" />
        </div>
      </div>

      <div className="col-md-12" style={{marginTop: 20}}>
        <PlayerMatchHistory player={player} />
      </div>
    </div>
  );
};
