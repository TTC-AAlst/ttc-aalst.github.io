import React from 'react';
import {ITeam} from '../../../models/model-interfaces';

type DivisionRankingLabelProps = {
  divisionRanking: {
    position: number;
  };
}

export const DivisionRankingLabel = ({divisionRanking}: DivisionRankingLabelProps) => {
  if (!divisionRanking || !divisionRanking.position) {
    return null;
  }

  return <small className="match-opponent-team">{divisionRanking.position}. </small>;
};



export const OurDivisionRankingLabel = ({team}: {team: ITeam}) => {
  const divisionRanking = team.getDivisionRanking('our-ranking');
  if (divisionRanking.empty || !divisionRanking.position) {
    return null;
  }

  return <small style={{marginRight: 6}}>{divisionRanking.position}.</small>;
};
