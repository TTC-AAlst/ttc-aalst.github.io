import React from 'react';
import {IMatch} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';

type MatchDateProps = {
  match: IMatch;
  bigDisplayMinWidth?: number;
}

export const MatchDate = ({match, bigDisplayMinWidth}: MatchDateProps) => {
  const viewport = useViewport();
  if (viewport.width > (bigDisplayMinWidth ?? 768)) {
    // Big
    if (match.isStandardStartTime()) {
      return <span>{t('match.date', match.getDisplayDate())}</span>;
    }
    return <span>{match.getDisplayDate('d')} <strong>{t('match.date', match.getDisplayTime())}</strong></span>;

  }

  // Small
  if (match.isStandardStartTime()) {
    return <span>{match.getDisplayDate('s')}</span>;
  }
  return (
    <span>
      {match.getDisplayDate('s')}
      <br />
      {!match.isSyncedWithFrenoy ? <strong>{t('match.date', match.getDisplayTime())}</strong> : null}
    </span>
  );
};
