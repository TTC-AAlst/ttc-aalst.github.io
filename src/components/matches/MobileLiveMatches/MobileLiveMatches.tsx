import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchCard } from './MobileLiveMatchCard';
import { useViewport } from '../../../utils/hooks/useViewport';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';

type MobileLiveMatchesProps = {
  matches: IMatch[];
};

export const MobileLiveMatches = ({ matches }: MobileLiveMatchesProps) => {
  const viewport = useViewport();
  const isMobile = viewport.width < 992;

  // Only collapsible on mobile with multiple matches
  const isCollapsible = isMobile && matches.length > 1;

  // On mobile with multiple matches: start collapsed. Otherwise: start expanded.
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => (
    isCollapsible ? new Set() : new Set(matches.map(m => m.id))
  ));

  const allExpanded = matches.every(m => expandedIds.has(m.id));
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(matches.map(m => m.id)));
    }
  };

  const toggleMatch = (matchId: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) {
        next.delete(matchId);
      } else {
        next.add(matchId);
      }
      return next;
    });
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
            expanded={!isCollapsible || expandedIds.has(match.id)}
            onToggle={() => toggleMatch(match.id)}
            isCollapsible={isCollapsible}
          />
        ))}
      </div>
      {isCollapsible && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button variant="outline-secondary" size="sm" onClick={toggleAll}>
            <Icon fa={allExpanded ? 'fa fa-compress' : 'fa fa-expand'} />
            {' '}
            {allExpanded ? t('match.collapseAll') : t('match.expandAll')}
          </Button>
        </div>
      )}
    </div>
  );
};
