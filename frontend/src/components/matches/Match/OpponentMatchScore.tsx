import React from 'react';
import {ViewMatchDetailsButton} from '../controls/ViewMatchDetailsButton';
import { IMatch } from '../../../models/model-interfaces';

export const OpponentMatchScore = ({readonlyMatch}: {readonlyMatch: IMatch}) => {
  if (readonlyMatch.isOurMatch) {
    const match = readonlyMatch.getOurMatch();
    return <ViewMatchDetailsButton match={match} size="sm" />;
  }

  if (readonlyMatch.scoreType === 'WalkOver') {
    return <span>WO</span>;
  }

  if (!readonlyMatch.isSyncedWithFrenoy) {
    return null;
  }

  return <span>{readonlyMatch.score.home} - {readonlyMatch.score.out}</span>;
};
