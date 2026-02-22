import React, {Component} from 'react';
import {Icon, IconProps} from './Icon';
import {t} from '../../../locales';


export const ThumbsUpIcon = ({style, ...props}: Omit<IconProps, 'fa'>) => (
  <Icon
    fa="fa fa-thumbs-o-up"
    color="#9ACA66"
    translate
    tooltip="teamCalendar.matchesWonBadge"
    style={({marginRight: 5, ...style})}
    {...props}
  />
);

export const ThumbsDownIcon = ({style, ...props}: Omit<IconProps, 'fa'>) => (
  <Icon
    fa="fa fa-thumbs-o-down"
    color="#FF5144"
    translate
    tooltip="teamCalendar.matchesLostBadge"
    style={({marginRight: 5, ...style})}
    {...props}
  />
);



export class ThumbsGreatIcon extends Component<Omit<IconProps, 'fa'>> {
  render() {
    return (
      <Icon
        fa="fa fa-thumbs-up"
        tooltip={t('teamCalendar.matchesWonAllBadge')}
        {...this.props}
      />
    );
  }
}
