import React from 'react';
import { TeamRankingBadges } from './TeamRankingBadges';
import { TeamPosition } from './TeamPosition';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';
import { useViewport } from '../../../utils/hooks/useViewport';

type TeamTabTitleProps = {
  team: ITeam;
  showRanking: boolean;
  opponent?: ITeamOpponent;
}

export const TeamTabTitle = ({team, opponent, showRanking}: TeamTabTitleProps) => {
  const viewport = useViewport();
  const small = viewport.width < 600;
  return (
    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap', width: '100%'}}>
      <TeamPosition team={team} opponent={opponent} small={small} />
      <span style={{whiteSpace: 'nowrap'}}>{team.renderOwnTeamTitle()}</span>
      {showRanking ? (
        <div style={{marginLeft: 'auto', flexShrink: 0, marginRight: 12}}>
          <TeamRankingBadges team={team} opponent={opponent} small={small} />
        </div>
      ) : null}
    </div>
  );
};
