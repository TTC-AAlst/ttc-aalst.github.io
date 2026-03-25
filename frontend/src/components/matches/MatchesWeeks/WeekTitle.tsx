import React from 'react';
import { WeekCalcer } from './WeekCalcer';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';

type WeekTitleProps = {
  weekCalcer: WeekCalcer,
  weekChange?: Function,
  style?: React.CSSProperties,
}

export const WeekTitle = ({weekCalcer, style, weekChange}: WeekTitleProps) => {
  const viewport = useViewport();
  const week = weekCalcer.getWeek();

  if (!week) {
    return null;
  }

  let extraTitle: any = null;
  if (viewport.width > 450) {
    extraTitle = (
      <span>
        :
        &nbsp;
        {week.start.format('D/M')}
        &nbsp;-&nbsp;
        {week.end.format('D/M')}
      </span>
    );
  }

  return (
    <h3 style={{textAlign: 'center', ...style}}>
      {weekChange ? (
        <Icon
          fa="fa fa-arrow-left"
          style={{marginRight: 10, visibility: weekCalcer.currentWeek > weekCalcer.firstWeek ? undefined : 'hidden'}}
          onClick={() => weekChange(-1)}
          translate
          tooltip="week.prevWeek"
          tooltipPlacement="bottom"
        />
      ) : null}

      {t('match.week')}
      &nbsp;
      {weekCalcer.currentWeek}
      {extraTitle}

      {weekChange && weekCalcer.currentWeek < weekCalcer.lastWeek ? (
        <Icon
          fa="fa fa-arrow-right"
          style={{marginLeft: 10}}
          onClick={() => weekChange(1)}
          translate
          tooltip="week.nextWeek"
          tooltipPlacement="bottom"
        />
      ) : null}
    </h3>
  );
};
