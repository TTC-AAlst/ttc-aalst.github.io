import React from 'react';
import { Strike } from '../controls/controls/Strike';
import { PlayerLink } from '../players/controls/PlayerLink';
import { selectMatches, selectTeams, useTtcSelector } from '../../utils/hooks/storeHooks';
import { IPlayerCompetition, IStorePlayer, ITeamPlayerStats } from '../../models/model-interfaces';
import { getPlayerStats } from '../../models/TeamModel';
import rankingSorter from '../../models/utils/rankingSorter';

type TopPerformer = {
  player: IStorePlayer;
  winPercentage: number;
  gamesPlayed: number;
  victories: number;
};

type TopStijger = {
  player: IStorePlayer;
  competition: 'Vttl' | 'Sporta';
  current: string;
  predicted: string;
  rankingsGained: number;
};

const getRankingDifference = (comp: IPlayerCompetition): number => {
  if (!comp.prediction) return 0;
  return rankingSorter(comp.ranking, comp.prediction);
};

export const SeasonStats = () => {
  const matches = useTtcSelector(selectMatches);
  const teams = useTtcSelector(selectTeams);
  const players = useTtcSelector(state => state.players);

  // Get all synced matches
  const playedMatches = matches.filter(m => m.isSyncedWithFrenoy && m.scoreType !== 'WalkOver');

  // Calculate overall win/loss/draw
  const wins = playedMatches.filter(m => m.scoreType === 'Won').length;
  const losses = playedMatches.filter(m => m.scoreType === 'Lost').length;
  const draws = playedMatches.filter(m => m.scoreType === 'Draw').length;
  const totalMatches = wins + losses + draws;

  // Get player stats across all teams
  const allPlayerStats: ITeamPlayerStats[] = [];
  teams.forEach(team => {
    const teamStats = team.getPlayerStats();
    teamStats.forEach(stat => {
      const existing = allPlayerStats.find(s => s.ply.id === stat.ply.id);
      if (existing) {
        existing.games += stat.games;
        existing.victories += stat.victories;
      } else {
        allPlayerStats.push({ ...stat });
      }
    });
  });

  // Get top performers (min 10 games, sorted by win %)
  const topPerformers: TopPerformer[] = allPlayerStats
    .filter(s => s.games >= 10 && s.ply.id)
    .map(s => ({
      player: players.find(p => p.id === s.ply.id)!,
      winPercentage: Math.round((s.victories / s.games) * 100),
      gamesPlayed: s.games,
      victories: s.victories,
    }))
    .filter(p => p.player)
    .sort((a, b) => b.winPercentage - a.winPercentage || b.gamesPlayed - a.gamesPlayed)
    .slice(0, 3);

  // Get top stijgers (more than 1 ranking improvement)
  const topStijgers: TopStijger[] = [];
  players.forEach(player => {
    if (player.vttl?.prediction) {
      const diff = getRankingDifference(player.vttl);
      if (diff > 1) {
        topStijgers.push({
          player,
          competition: 'Vttl',
          current: player.vttl.ranking,
          predicted: player.vttl.prediction,
          rankingsGained: diff,
        });
      }
    }
    if (player.sporta?.prediction) {
      const diff = getRankingDifference(player.sporta);
      if (diff > 1) {
        topStijgers.push({
          player,
          competition: 'Sporta',
          current: player.sporta.ranking,
          predicted: player.sporta.prediction,
          rankingsGained: diff,
        });
      }
    }
  });
  topStijgers.sort((a, b) => b.rankingsGained - a.rankingsGained);

  if (totalMatches === 0) {
    return null;
  }

  const winRate = Math.round((wins / totalMatches) * 100);

  return (
    <div style={{marginBottom: 20}}>
      <Strike text="Seizoen in cijfers" style={{marginBottom: 12}} />

      {/* Match stats */}
      <div style={{marginBottom: 16}}>
        <div style={{fontSize: '1.1em', marginBottom: 8}}>
          <strong>{totalMatches}</strong> matchen gespeeld
          <span style={{color: '#666', marginLeft: 8}}>({winRate}% winst)</span>
        </div>
        <div style={{display: 'flex', gap: 16, fontSize: '0.95em'}}>
          <span style={{color: '#4CAF50'}}>
            <strong>{wins}</strong> gewonnen
          </span>
          <span style={{color: '#FF9800'}}>
            <strong>{draws}</strong> gelijk
          </span>
          <span style={{color: '#f44336'}}>
            <strong>{losses}</strong> verloren
          </span>
        </div>
      </div>

      {/* Top performers */}
      {topPerformers.length > 0 && (
        <div style={{marginBottom: 16}}>
          <div style={{fontWeight: 500, marginBottom: 6, color: '#495057'}}>
            Top spelers
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            {topPerformers.map((p, i) => (
              <div key={p.player.id} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75em',
                  fontWeight: 'bold',
                  color: i === 0 ? '#333' : 'white',
                }}>
                  {i + 1}
                </span>
                <PlayerLink player={p.player} />
                <span style={{color: '#666', fontSize: '0.9em'}}>
                  {p.winPercentage}% ({p.victories}/{p.gamesPlayed})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top stijgers */}
      {topStijgers.length > 0 && (
        <div>
          <div style={{fontWeight: 500, marginBottom: 6, color: '#495057'}}>
            Opkomende talenten
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
            {topStijgers.slice(0, 4).map(s => (
              <span
                key={`${s.player.id}-${s.competition}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#e8f5e9',
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: '0.85em',
                }}
              >
                <PlayerLink player={s.player} alias style={{fontWeight: 500, marginRight: 4}} />
                <span style={{color: '#4CAF50', fontWeight: 500}}>
                  {s.current} → {s.predicted}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
