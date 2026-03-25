import React from 'react';
import MatchVs from './MatchVs';
import { IMatch } from '../../../models/model-interfaces';

export const TheirTeamTitle = ({match, ...props}: {match: IMatch, withLinks?: boolean}) => (
  <span className="match-opponent-team">
    <MatchVs match={match} themOnly {...props} />
  </span>
);
