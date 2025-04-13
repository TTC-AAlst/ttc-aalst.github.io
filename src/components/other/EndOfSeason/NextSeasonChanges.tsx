import React from 'react';
import cn from 'classnames';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {AchievementsCalculator, NewPlayerRanking} from './AchievementsCalculator';

type NextSeasonChangesProps = {
  calcer: AchievementsCalculator;
}

export const NextSeasonChanges = ({calcer}: NextSeasonChangesProps) => {
  const vttl = calcer.getNewRanking('Vttl');
  const sporta = calcer.getNewRanking('Sporta');

  if (!vttl.length && !sporta.length) {
    return null;
  }

  return (
    <div>
      <h2>
        <i className="fa fa-line-chart" style={{marginRight: 15, color: 'gray'}} />
        Volgend Seizoen
        <i className="fa fa-line-chart" style={{marginLeft: 15, color: 'gray'}} />
      </h2>
      <div className="row next-season">
        {!!vttl.length && (
          <div className="col-md-6">
            <h3>Vttl</h3>
            <NextSeasonRankingChanges rankings={vttl} />
          </div>
        )}
        {!!sporta.length && (
          <div className="col-md-6">
            <h3>Sporta</h3>
            <NextSeasonRankingChanges rankings={sporta} />
          </div>
        )}
      </div>
    </div>
  );
};


const NextSeasonRankingChanges = ({rankings}: {rankings: NewPlayerRanking[]}) => {
  if (!rankings.length) {
    return null;
  }

  const highest = rankings.reduce((acc, cur) => (acc.oldValue - acc.newValue > cur.oldValue - cur.newValue ? cur : acc), rankings[0]);
  return (
    <div className="row">
      {rankings.map(ranking => {
        const rankingDrop = ranking.oldValue > ranking.newValue ? 'ranking-drop' : null;
        const highestMounter = ranking.oldValue - ranking.newValue === highest.oldValue - highest.newValue;
        return (
          <div key={ranking.ply.id} className={cn('col-sm-6', rankingDrop, (highestMounter ? 'highest-mounter' : null))}>
            <PlayerLink player={ranking.ply} style={{marginRight: 12}} />
            {ranking.old}
            <i className="fa fa-long-arrow-right" style={{marginLeft: 8, marginRight: 8}} />
            {ranking.new}
          </div>
        );
      })}
    </div>
  );
};
