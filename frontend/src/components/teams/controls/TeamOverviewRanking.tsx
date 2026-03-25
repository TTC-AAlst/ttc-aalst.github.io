import React from 'react';
import cn from 'classnames';
import { OwnClubId } from '../../../models/ClubModel';
import { OpponentLink } from './OpponentLink';
import { ITeam } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import storeUtil from '../../../storeUtil';

type TeamOverviewRankingProps = {
  team: ITeam;
  small: boolean;
}

export const TeamOverviewRanking = ({team, small}: TeamOverviewRankingProps) => {
  let {ranking} = team;

  if (ranking.length === 0) {
    return <div />;
  }

  if (small) {
    const ownTeamIndex = ranking.findIndex(r => r.clubId === OwnClubId);
    ranking = ranking.slice(Math.max(ownTeamIndex - 2, 0), ownTeamIndex + 3);
  }
  return (
    <div>
      <h3>{t('teamCalendar.view.ranking')}</h3>
      {ranking.map(teamRanking => {
        const isOwnClub = teamRanking.clubId === OwnClubId;
        const points = isOwnClub ? teamRanking.points : `(${teamRanking.points})`;
        return (
          <div
            key={teamRanking.clubId + teamRanking.teamCode}
            style={{marginRight: 15, display: 'inline-block', fontSize: isOwnClub ? 14 : undefined, fontWeight: isOwnClub ? 'bold' : undefined}}
            className={cn({'badge label-as-badge bg-info': isOwnClub && !small})}
          >
            {!isOwnClub ? (
              <OpponentLink team={team} opponent={{clubId: teamRanking.clubId, teamCode: teamRanking.teamCode}} />
            ) : (
              <span>
                {teamRanking.position}.&nbsp;
                {storeUtil.getClub(teamRanking.clubId).name} {teamRanking.teamCode}
              </span>
            )}
            &nbsp;
            <span style={{marginLeft: 7}}>{points}</span>
          </div>
        );
      })}
    </div>
  );
};
