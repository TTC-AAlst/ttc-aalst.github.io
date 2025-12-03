import React from 'react';
import { Strike } from '../../controls/controls/Strike';
import { PlayerPerformanceCard, PlayerCompetitionStats } from './PlayerPerformanceCard';
import { selectMatches, selectTeams, selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { ITeamPlayerStats, Competition, IPlayer } from '../../../models/model-interfaces';
import { getPlayerStats } from '../../../models/TeamModel';
import t from '../../../locales';

type PlayerWithCompetitionStats = {
  player: IPlayer;
  vttl: PlayerCompetitionStats | null;
  sporta: PlayerCompetitionStats | null;
};

export const TeamPlayerPerformance = () => {
  const user = useTtcSelector(selectUser);
  const teams = useTtcSelector(selectTeams);
  const allMatches = useTtcSelector(selectMatches);

  const userTeams = teams.filter(team => user.teams.includes(team.id));

  if (userTeams.length === 0) {
    return null;
  }

  // Get all player stats for user's teams, grouped by competition
  const statsByPlayerAndCompetition = new Map<number, { player: IPlayer; vttl: ITeamPlayerStats | null; sporta: ITeamPlayerStats | null }>();

  userTeams.forEach(team => {
    const teamMatches = allMatches.filter(m => m.teamId === team.id && m.isSyncedWithFrenoy);
    const stats = getPlayerStats(teamMatches);
    stats.forEach(stat => {
      if (stat.games > 0 && !stat.isDoubles) {
        const existing = statsByPlayerAndCompetition.get(stat.ply.id);
        if (!existing) {
          statsByPlayerAndCompetition.set(stat.ply.id, {
            player: stat.ply,
            vttl: team.competition === 'Vttl' ? stat : null,
            sporta: team.competition === 'Sporta' ? stat : null,
          });
        } else if (team.competition === 'Vttl') {
          if (existing.vttl) {
            existing.vttl.games += stat.games;
            existing.vttl.victories += stat.victories;
          } else {
            existing.vttl = stat;
          }
        } else if (team.competition === 'Sporta') {
          if (existing.sporta) {
            existing.sporta.games += stat.games;
            existing.sporta.victories += stat.victories;
          } else {
            existing.sporta = stat;
          }
        }
      }
    });
  });

  const playerStats: PlayerWithCompetitionStats[] = Array.from(statsByPlayerAndCompetition.values()).map(entry => ({
    player: entry.player,
    vttl: entry.vttl ? { games: entry.vttl.games, victories: entry.vttl.victories } : null,
    sporta: entry.sporta ? { games: entry.sporta.games, victories: entry.sporta.victories } : null,
  }));

  if (playerStats.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.teamPlayerPerformance')} style={{marginBottom: 6}} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15}}>
        {playerStats.map(stat => (
          <PlayerPerformanceCard key={stat.player.id} player={stat.player} vttl={stat.vttl} sporta={stat.sporta} />
        ))}
      </div>
    </div>
  );
};
