import React from 'react';
import {matchOutcome} from '../../../models/MatchModel';
import rankingSorter, { PlayerRanking } from '../../../models/utils/rankingSorter';
import {PlayerCompetitionBadge} from '../../players/PlayerBadges';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {ThumbsUpIcon, ThumbsGreatIcon} from '../../controls/Icons/ThumbsIcons';
import storeUtil from '../../../storeUtil';
import { IGetGameMatches, IMatch, IMatchPlayer } from '../../../models/model-interfaces';

type OwnPlayerProps = {
  match: IMatch;
  ply: IMatchPlayer;
  playerAsBadge?: boolean,
};

const OwnPlayer = ({match, ply, playerAsBadge = false}: OwnPlayerProps) => {
  const result = getRankingResults(match, ply);
  if (result.wo) {
    return <s>{ply.alias}</s>;
  }

  const teamPlayerCount = match.getTeam().getTeamPlayerCount();
  const winNode = renderWinsNode(result, teamPlayerCount);
  const plyInfo = {
    player: storeUtil.getPlayer(ply.playerId),
    matchPlayer: {status: ply.status},
  };

  return (
    <div style={{marginRight: 10}}>
      {playerAsBadge ? (
        <PlayerCompetitionBadge plyInfo={plyInfo} competition={match.competition} style={{marginBottom: 8, marginRight: 8}} />
      ) : (
        <span className="accentuate" style={{marginRight: 7}}>
          <strong><PlayerLink player={plyInfo.player} alias /></strong>
        </span>
      )}
      {result.win.length !== teamPlayerCount && result.win.length ? <ThumbsUpIcon /> : null}
      {winNode}
    </div>
  );
};


function renderWinsNode(result: RankingResult, teamPlayerCount: 2 | 3 | 4) {
  let winNode: any = '';
  if (result.win.length > 0) {
    const wins = {};
    for (let i = 0; i < result.win.length; i++) {
      const curWin = result.win[i];
      if (!wins[curWin]) {
        wins[curWin] = 1;
      } else {
        wins[curWin]++;
      }
    }

    Object.keys(wins).forEach(key => {
      if (wins[key] === 1) {
        winNode += `, ${key}`;
      } else {
        winNode += `, ${wins[key]}x${key}`;
      }
    });
    winNode = result.win.length === teamPlayerCount ? <ThumbsGreatIcon /> : <small>{winNode.substr(2)}</small>;
  }
  return winNode;
}

type RankingResult = {
  win: PlayerRanking[];
  lost: PlayerRanking[];
  wo: boolean;
}

function getRankingResults(match: IMatch, ply: IMatchPlayer): RankingResult {
  const getAdversaryRanking = (game: IGetGameMatches) => (game.home.uniqueIndex === ply.uniqueIndex ? game.out.ranking : game.home.ranking);

  const plyMatches = match.getGameMatches().filter(game => game.ownPlayer === ply);
  if (plyMatches.every(game => game.outcome === 'WalkOver')) {
    return {
      win: [],
      lost: [],
      wo: true,
    };
  }
  const win = plyMatches.filter(game => game.outcome === matchOutcome.Won);
  const lost = plyMatches.filter(game => game.outcome === matchOutcome.Lost);
  return {
    win: win.map(getAdversaryRanking).sort(rankingSorter),
    lost: lost.map(getAdversaryRanking).sort(rankingSorter),
    wo: false,
  };
}

export default OwnPlayer;
