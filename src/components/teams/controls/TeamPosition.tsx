import React from 'react';
import { Badgy } from '../../controls/Icons/ThrillerIcon';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';

type TeamPositionProps = {
  team: ITeam;
  opponent?: ITeamOpponent;
  style?: React.CSSProperties;
}

const defaultStyle = {
  marginRight: 8,
  marginTop: -5,
};

export const TeamPosition = ({team, opponent, style = defaultStyle}: TeamPositionProps) => {
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
    <Badgy type={positionClassName} style={style} tooltip="teamCalendar.teamRanking">
      {ranking.position} / {team.ranking.length}
    </Badgy>
  );
};
