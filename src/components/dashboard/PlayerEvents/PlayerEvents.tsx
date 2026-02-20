import React from 'react';
import dayjs from 'dayjs';
import { Strike } from '../../controls/controls/Strike';
import { PlayerEventItem } from './PlayerEventItem';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';
import t from '../../../locales';

export const PlayerEvents = () => {
  const playerEvents = useTtcSelector(state => state.events);

  // Filter events from last 14 days
  const twoWeeksAgo = dayjs().subtract(14, 'days');
  const recentEvents = playerEvents
    .slice()
    // .filter(event => dayjs(event.createdOn).isAfter(twoWeeksAgo))
    .sort((a, b) => dayjs(b.createdOn).valueOf() - dayjs(a.createdOn).valueOf());

  if (recentEvents.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.playerEvents')} />
      <div style={{backgroundColor: '#fafafa', padding: 10, borderRadius: 4}}>
        {recentEvents.map(event => (
          <PlayerEventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
