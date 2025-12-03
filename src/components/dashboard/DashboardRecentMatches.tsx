import React from 'react';
import moment from 'moment';
import { Strike } from '../controls/controls/Strike';
import { MatchMiniView } from './MatchMiniView';
import { selectMatches, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import t from '../../locales';

export const DashboardRecentMatches = () => {
  const matches = useTtcSelector(selectMatches);
  const user = useTtcSelector(selectUser);

  const today = moment();
  const lastWeek = moment().subtract(7, 'days');

  // Get matches from previous week and current week
  const recentMatches = matches
    .filter(match => {
      const matchDate = moment(match.date);
      return matchDate.isBetween(lastWeek, today, 'day', '[]');
    })
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  if (recentMatches.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.recentMatches')} />
      {recentMatches.map(match => {
        const isUserTeam = user.teams.includes(match.teamId);
        return (
          <MatchMiniView
            key={match.id}
            match={match}
            highlight={isUserTeam}
          />
        );
      })}
    </div>
  );
};
