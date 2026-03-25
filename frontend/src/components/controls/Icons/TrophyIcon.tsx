import React from 'react';
import {Icon, IconProps} from './Icon';

export const TrophyIcon = ({style = undefined, color = '#FCB514', ...props}: Omit<IconProps, 'fa'>) => (
  <Icon fa="fa fa-trophy" color={color} style={style} translate tooltip="teamCalendar.matchesWon" {...props} />
);
