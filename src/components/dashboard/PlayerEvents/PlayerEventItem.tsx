import React from 'react';
import { IPlayerEvent } from '../../../models/model-interfaces';
import { TimeAgo } from '../../controls/controls/TimeAgo';

type PlayerEventItemProps = {
  event: IPlayerEvent;
};

export const PlayerEventItem = ({ event }: PlayerEventItemProps) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType?.toLowerCase()) {
      case 'style_changed':
        return '🎨';
      case 'ranking_changed':
        return '📊';
      case 'joined_team':
        return '👋';
      case 'left_team':
        return '👋';
      default:
        return '📌';
    }
  };

  return (
    <div
      style={{
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderLeft: '3px solid #2196F3',
      }}
    >
      <div style={{display: 'flex', alignItems: 'start', gap: 8}}>
        <span style={{fontSize: '1.2em'}}>{getEventIcon(event.eventType)}</span>
        <div style={{flex: 1}}>
          <div style={{fontSize: '0.85em', fontWeight: 'bold', color: '#333'}}>
            {event.playerName}
          </div>
          <div style={{fontSize: '0.8em', color: '#666', marginTop: 2}}>
            {event.description}
          </div>
          <div style={{fontSize: '0.75em', color: '#999', marginTop: 4}}>
            <TimeAgo date={event.timestamp} />
          </div>
        </div>
      </div>
    </div>
  );
};
