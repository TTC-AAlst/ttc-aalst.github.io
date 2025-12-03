import React from 'react';
import { Strike } from '../../controls/controls/Strike';
import { PlayerPerformanceCard } from './PlayerPerformanceCard';
import { selectMatches, selectTeams, selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { ITeamPlayerStats } from '../../../models/model-interfaces';
import { getPlayerStats } from '../../../models/TeamModel';
import t from '../../../locales';

export const TeamPlayerPerformance = () => {
  const user = useTtcSelector(selectUser);
  const teams = useTtcSelector(selectTeams);
  const allMatches = useTtcSelector(selectMatches);

  const userTeams = teams.filter(team => user.teams.includes(team.id));

  if (userTeams.length === 0) {
    return null;
  }

  // Get all player stats for user's teams
  const allPlayerStats: ITeamPlayerStats[] = [];
  userTeams.forEach(team => {
    const teamMatches = allMatches.filter(m => m.teamId === team.id && m.isSyncedWithFrenoy);
    const stats = getPlayerStats(teamMatches);
    stats.forEach(stat => {
      if (stat.games > 0 && !stat.isDoubles) {
        allPlayerStats.push(stat);
      }
    });
  });

  // Remove duplicates (players who play in multiple teams)
  const uniquePlayerStats = allPlayerStats.reduce((acc, stat) => {
    const existing = acc.find(s => s.ply.id === stat.ply.id);
    if (!existing) {
      acc.push(stat);
    } else {
      // Merge stats if player is in multiple teams
      existing.games += stat.games;
      existing.victories += stat.victories;
    }
    return acc;
  }, [] as ITeamPlayerStats[]);

  if (uniquePlayerStats.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.teamPlayerPerformance')} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15}}>
        {uniquePlayerStats.map(stat => (
          <PlayerPerformanceCard key={stat.ply.id} playerStat={stat} />
        ))}
      </div>
    </div>
  );
};
