import React from 'react';
import { OpponentLink } from '../../teams/controls/OpponentLink';
import { IMatch, ITeam } from '../../../models/model-interfaces';

type OtherMatchTeamTitleProps = {
  team: ITeam;
  readonlyMatch: IMatch;
  isHome: boolean;
  withPosition: boolean;
}

export const OtherMatchTeamTitle = ({team, readonlyMatch, isHome, withPosition}: OtherMatchTeamTitleProps) => {
  const opponent = isHome ? readonlyMatch.home : readonlyMatch.away;
  return <OpponentLink team={team} opponent={opponent} withPosition={withPosition} />;
};
