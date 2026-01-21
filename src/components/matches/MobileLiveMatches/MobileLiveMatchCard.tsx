import React from 'react';
import { IMatch } from '../../../models/model-interfaces';
import { MobileLiveMatchHeader } from './MobileLiveMatchHeader';
import { MobileLiveMatchInProgress } from './MobileLiveMatchInProgress';
import { Icon } from '../../controls/Icons/Icon';

type MobileLiveMatchCardProps = {
  match: IMatch;
  expanded: boolean;
  onToggle: () => void;
  /** When false, the card is always expanded and not collapsible */
  isCollapsible: boolean;
};

export const MobileLiveMatchCard = ({ match, expanded, onToggle, isCollapsible }: MobileLiveMatchCardProps) => {
  const showContent = !isCollapsible || expanded;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid #ddd',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative' }}>
        <MobileLiveMatchHeader match={match} />
        {isCollapsible && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              padding: 0,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              color: '#666',
            }}
          >
            <Icon fa={expanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
          </button>
        )}
      </div>
      {showContent && <MobileLiveMatchInProgress match={match} />}
    </div>
  );
};
