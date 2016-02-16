import React from 'react';

import { matchOutcome } from '../../../models/MatchModel.js';
//import { getPlayersPerTeam } from '../../../models/TeamModel.js';
import rankingSorter from '../../../models/utils/rankingSorter.js';

import Icon from '../../controls/Icon.js';
import cn from 'classnames';

const OwnPlayer = ({match, ply, team}) => {
  var getAdversaryRanking = game => game.home.uniqueIndex === ply.uniqueIndex ? game.out.ranking : game.home.ranking;
  var getRankingResults = function() {
    var plyMatches = match.getGameMatches().filter(game => game.ownPlayer === ply);
    if (plyMatches.every(game => game.outcome === 'WalkOver')) {
      return {
        win: [],
        lost: [],
        wo: true
      };
    }
    var win = plyMatches.filter(game => game.outcome === matchOutcome.Won);
    var lost = plyMatches.filter(game => game.outcome === matchOutcome.Lost);
    return {
      win: win.map(getAdversaryRanking).sort(rankingSorter),
      lost: lost.map(getAdversaryRanking).sort(rankingSorter),
      wo: false
    };
  };

  var result = getRankingResults();
  var winNode = '';
  if (result.win.size > 0) {
    let wins = {};
    for (let i = 0; i < result.win.size; i++) {
      let curWin = result.win.get(i);
      if (!wins[curWin]) {
        wins[curWin] = 1;
      } else {
        wins[curWin]++;
      }
    }

    Object.keys(wins).forEach(key => {
      if (wins[key] === 1) {
        winNode += ', ' + key;
      } else {
        winNode += `, ${wins[key]}x${key}`;
      }
    });
    winNode = result.win.size === team.getTeamPlayerCount() ? <Icon fa="fa fa-thumbs-up" /> : <small>{winNode.substr(2)}</small>;
  }

  return (
    <div>
      <span className={cn('accentuate', {irrelevant: result.wo})} style={{marginRight: 7}}>{ply.name}</span>
      {winNode}
    </div>
  );
};

export default OwnPlayer;