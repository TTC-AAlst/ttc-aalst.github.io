import React from 'react';
import dayjs from 'dayjs';
import {ButtonStack} from '../controls/Buttons/ButtonStack';
import { t } from '../../locales';
import { IStoreMatchCommon } from '../../models/model-interfaces';

type Filters = 'all' | 'first' | 'last';

type SwitchBetweenFirstAndLastRoundButtonProps = {
  setMatchesFilter: (f: Filters) => void,
  matchesFilter: Filters,
};

export const SwitchBetweenFirstAndLastRoundButton = ({setMatchesFilter, matchesFilter}: SwitchBetweenFirstAndLastRoundButtonProps) => (
  <div style={{textAlign: 'center'}}>
    <ButtonStack
      config={[
        {key: 'all', text: t('common.all')},
        {key: 'first', text: t('comp.roundFirst')},
        {key: 'last', text: t('comp.roundBack')},
      ]}
      small={false}
      activeView={matchesFilter}
      onClick={newFilter => {
        setMatchesFilter(newFilter as Filters);
        window.scrollTo(0, 0);
      }}
    />
  </div>
);


export function getFirstOrLastMatches<T extends IStoreMatchCommon>(allMatchesToCome: T[], filter: Filters) {
  if (filter === 'all') {
    return {
      matches: allMatchesToCome,
      hasMore: false,
    };
  }

  const firstMatches = allMatchesToCome.filter(x => x.date.month() >= 7);
  const lastMatches = allMatchesToCome.filter(x => x.date.month() < 7);
  if (filter === 'first' && firstMatches.length !== 0) {
    return {
      matches: firstMatches.sort((a, b) => a.date.valueOf() - b.date.valueOf()),
      hasMore: lastMatches.length !== 0,
    };
  }
  return {
    matches: lastMatches.sort((a, b) => a.date.valueOf() - b.date.valueOf()),
    hasMore: firstMatches.length !== 0,
  };
}




export function getFirstOrLast(): Filters {
  const today = dayjs();
  return today.month() >= 5 && !(today.month() === 11 && today.date() > 20) ? 'first' : 'last';
}
