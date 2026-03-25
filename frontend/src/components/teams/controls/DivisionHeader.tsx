import React from 'react';

import {TeamRankingBadges} from './TeamRankingBadges';
import {TeamPosition} from './TeamPosition';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';
import { useViewport } from '../../../utils/hooks/useViewport';

type DivisionHeaderProps = {
  team: ITeam;
  opponent?: ITeamOpponent;
  withVictoryBadges?: boolean;
}

export const DivisionHeader = ({team, opponent, withVictoryBadges = true}: DivisionHeaderProps) => {
  const viewport = useViewport();
  const small = viewport.width < 600;
  const containerStyle: React.CSSProperties = small ? {fontSize: 16} : {};
  return (
    <div style={containerStyle}>
      <TeamPosition team={team} opponent={opponent} small={small} />
      {team.getDivisionDescription()}
      {withVictoryBadges ? <TeamRankingBadges team={team} opponent={opponent} small={small} /> : null}
    </div>
  );
};
