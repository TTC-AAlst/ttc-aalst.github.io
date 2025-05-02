import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IPlayerCompetition } from '../../../models/model-interfaces';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';

type PlayerRankingProps = {
  player: IPlayerCompetition | undefined,
}

export const PlayerRanking = ({player}: PlayerRankingProps) => {
  const endOfSeason = useTtcSelector(state => state.config.params.endOfSeason);
  const hasNextRankings = useTtcSelector(state => state.players.some(p => p[player?.competition?.toLowerCase() || 'vttl']?.nextRanking));

  if (!player) {
    return null;
  }

  const showEndOfSeason = endOfSeason && hasNextRankings;
  if (showEndOfSeason && player.nextRanking) {
    return <>{player.ranking} ⮕ {player.nextRanking}</>;
  }

  if (!showEndOfSeason && player.prediction) {
    const tooltip = <Tooltip id={player.uniqueIndex.toString()}>Oilsjt AI</Tooltip>;
    return (
      <>
        {player.ranking}
        <span style={{color: 'gray'}}> ⮕ </span>
        <OverlayTrigger overlay={tooltip}>
          <span style={{color: 'gray'}}>{player.nextRanking}</span>
        </OverlayTrigger>
      </>
    );
  }

  return <span>{player?.ranking}</span>;
};
