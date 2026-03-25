import React from 'react';
import { ThumbsUpIcon, ThumbsDownIcon } from '../../controls/Icons/ThumbsIcons';
import { PercentageLabel } from '../../controls/controls/PercentageLabel';
import { ITeamPlayerStats } from '../../../models/model-interfaces';

export const TeamOverviewPlayerStats = ({stat}: {stat: ITeamPlayerStats}) => (
  <span>
    <ThumbsUpIcon /> {stat.victories}
    <ThumbsDownIcon style={{marginLeft: 8}} /> {stat.games - stat.victories}
    &nbsp;
    <PercentageLabel won={stat.victories} lost={stat.games - stat.victories} />
  </span>
);
