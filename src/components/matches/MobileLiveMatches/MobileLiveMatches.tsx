import React, { useCallback, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchCard } from './MobileLiveMatchCard';
import { useViewport } from '../../../utils/hooks/useViewport';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { selectUser, useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { frenoyMatchSync } from '../../../reducers/matchesReducer';
import { toggleMatchCardExpanded } from '../../../reducers/configReducer';

const SYNC_COOLDOWN_MS = 10 * 60 * 1000;

type MobileLiveMatchesProps = {
  matches: IMatch[];
};

export const MobileLiveMatches = ({ matches }: MobileLiveMatchesProps) => {
  const viewport = useViewport();
  const isMobile = viewport.width < 992;
  const dispatch = useTtcDispatch();
  const user = useTtcSelector(selectUser);
  const expandedMatchCards = useTtcSelector(state => state.config.expandedMatchCards);
  const [syncDisabled, setSyncDisabled] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSyncAll = useCallback(() => {
    matches.forEach(match => dispatch(frenoyMatchSync({ match, forceSync: true })));
    setSyncDisabled(true);
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => setSyncDisabled(false), SYNC_COOLDOWN_MS);
  }, [matches, dispatch]);

  // Only collapsible on mobile with multiple matches
  const isCollapsible = isMobile && matches.length > 1;

  const allExpanded = matches.every(m => !!expandedMatchCards[m.id]);
  const toggleAll = () => {
    const shouldExpand = !allExpanded;
    matches.forEach(m => {
      if (!!expandedMatchCards[m.id] !== shouldExpand) {
        dispatch(toggleMatchCardExpanded(m.id));
      }
    });
  };

  const toggleMatch = (matchId: number) => {
    dispatch(toggleMatchCardExpanded(matchId));
  };

  return (
    <div style={{ paddingTop: 10 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {matches.map(match => (
          <MobileLiveMatchCard
            key={match.id}
            match={match}
            expanded={!isCollapsible || !!expandedMatchCards[match.id]}
            onToggle={() => toggleMatch(match.id)}
            isCollapsible={isCollapsible}
          />
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
        {isCollapsible && (
          <Button variant="outline-secondary" size="sm" onClick={toggleAll}>
            <Icon fa={allExpanded ? 'fa fa-compress' : 'fa fa-expand'} />
            {' '}
            {allExpanded ? t('match.collapseAll') : t('match.expandAll')}
          </Button>
        )}
        {user.playerId > 0 && (
          <Button variant="outline-secondary" size="sm" aria-label="sync" onClick={handleSyncAll} disabled={syncDisabled}>
            <Icon fa="fa fa-refresh" />
          </Button>
        )}
      </div>
    </div>
  );
};
