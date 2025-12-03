import React from 'react';
import moment from 'moment';
import { Strike } from '../../controls/controls/Strike';
import { PlayerEventItem } from './PlayerEventItem';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';
import t from '../../../locales';

export const PlayerEvents = () => {
  const playerEvents = useTtcSelector(state => state.events);

  // Filter events from last 14 days
  const twoWeeksAgo = moment().subtract(14, 'days');
  const recentEvents = playerEvents
    .slice()
    // .filter(event => moment(event.createdOn).isAfter(twoWeeksAgo))
    .sort((a, b) => moment(b.createdOn).valueOf() - moment(a.createdOn).valueOf());

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
