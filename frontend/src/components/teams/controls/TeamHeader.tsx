import React from 'react';
import { TeamRankingBadges } from './TeamRankingBadges';
import { ITeam } from '../../../models/model-interfaces';

type TeamHeaderProps = {
  team: ITeam;
  showRanking: boolean;
};

export const TeamHeader = ({team, showRanking}: TeamHeaderProps) => (
  <div>
    <h4 style={{marginLeft: 5}}>
      {team.getDivisionDescription()}
      {showRanking ? <TeamRankingBadges team={team} /> : null}
    </h4>
  </div>
);
