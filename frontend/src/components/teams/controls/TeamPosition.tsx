import React from 'react';
import { Badgy } from '../../controls/Icons/ThrillerIcon';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';

type TeamPositionProps = {
  team: ITeam;
  opponent?: ITeamOpponent;
  style?: React.CSSProperties;
  small?: boolean;
}

const defaultStyle = {
  marginRight: 8,
  marginTop: -5,
};

const smallStyle = {
  marginRight: 6,
  fontSize: 12,
};

export const TeamPosition = ({team, opponent, style, small}: TeamPositionProps) => {
  const appliedStyle = style || (small ? smallStyle : defaultStyle);
  const ranking = team.getDivisionRanking(opponent);
  if (ranking.empty) {
    return null;
  }

  let positionClassName;
  if (team.isTopper(opponent)) {
    positionClassName = 'match-won';
  } else if (team.isInDegradationZone(opponent)) {
    positionClassName = 'match-lost';
  } else {
    positionClassName = 'bg-secondary';
  }

  return (
    <Badgy type={positionClassName} style={appliedStyle} tooltip="teamCalendar.teamRanking">
      {ranking.position} / {team.ranking.length}
    </Badgy>
  );
};
