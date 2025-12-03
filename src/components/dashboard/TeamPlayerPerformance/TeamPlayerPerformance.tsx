import React, { useState } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { Strike } from '../../controls/controls/Strike';
import { PlayerPerformanceCard, PlayerCompetitionStats } from './PlayerPerformanceCard';
import { selectMatches, selectPlayers, selectTeams, selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { IPlayer, IMatch, ITeam } from '../../../models/model-interfaces';
import { GameResult } from '../../players/controls/PlayerPerformanceUtils';
import { PlayerRanking } from '../../../models/utils/rankingSorter';
import t from '../../../locales';

type MatchGameResults = {
  matchId: number;
  matchDate: moment.Moment;
  results: GameResult[];
};

type PlayerWithCompetitionStats = {
  player: IPlayer;
  vttl: PlayerCompetitionStats | null;
  sporta: PlayerCompetitionStats | null;
  vttlResults: GameResult[];
  sportaResults: GameResult[];
  recentResults: GameResult[]; // Results from last 2 matches per competition
};

const collectPlayerGameResultsByMatch = (
  playerId: number,
  playerRanking: PlayerRanking | undefined,
  matches: IMatch[],
): MatchGameResults[] => {
  const resultsByMatch: MatchGameResults[] = [];

  matches.forEach(match => {
    if (!match.isSyncedWithFrenoy) return;

    const matchResults: GameResult[] = [];
    const gameMatches = match.getGameMatches();

    gameMatches.forEach(game => {
      if (game.isDoubles) return;
      if (!('playerId' in game.ownPlayer) || game.ownPlayer.playerId !== playerId) return;

      const ownPlayer = game.ownPlayer as { playerId: number; ranking?: PlayerRanking };
      const opponent = match.isHomeMatch ? game.out : game.home;

      matchResults.push({
        won: game.outcome === 'Won',
        playerRanking: (playerRanking || ownPlayer.ranking || 'NG') as PlayerRanking,
        opponentRanking: (opponent?.ranking || 'NG') as PlayerRanking,
      });
    });

    if (matchResults.length > 0) {
      resultsByMatch.push({
        matchId: match.id,
        matchDate: match.date,
        results: matchResults,
      });
    }
  });

  // Sort by date descending (most recent first)
  resultsByMatch.sort((a, b) => b.matchDate.valueOf() - a.matchDate.valueOf());

  return resultsByMatch;
};

const getRecentResults = (
  vttlResultsByMatch: MatchGameResults[],
  sportaResultsByMatch: MatchGameResults[],
): GameResult[] => {
  // Get results from last 2 Vttl matches (4 games each = 8 games max)
  const recentVttl = vttlResultsByMatch.slice(0, 2).flatMap(m => m.results);
  // Get results from last 2 Sporta matches (3 games each = 6 games max)
  const recentSporta = sportaResultsByMatch.slice(0, 2).flatMap(m => m.results);

  return [...recentVttl, ...recentSporta];
};

const collectStatsForPlayers = (
  playerIds: Set<number>,
  allPlayers: IPlayer[],
  teams: ITeam[],
  allMatches: IMatch[],
): PlayerWithCompetitionStats[] => {
  const statsByPlayer = new Map<number, {
    player: IPlayer;
    vttlStats: { games: number; victories: number } | null;
    sportaStats: { games: number; victories: number } | null;
    vttlResultsByMatch: MatchGameResults[];
    sportaResultsByMatch: MatchGameResults[];
  }>();

  playerIds.forEach(playerId => {
    const playerInfo = allPlayers.find(p => p.id === playerId);
    if (!playerInfo) return;

    teams.forEach(team => {
      const teamMatches = allMatches.filter(m => m.teamId === team.id && m.isSyncedWithFrenoy);

      const ranking = team.competition === 'Sporta'
        ? playerInfo.sporta?.ranking
        : playerInfo.vttl?.ranking;

      const resultsByMatch = collectPlayerGameResultsByMatch(playerId, ranking as PlayerRanking, teamMatches);
      const results = resultsByMatch.flatMap(m => m.results);
      const games = results.length;
      const victories = results.filter(r => r.won).length;

      if (games === 0) return;

      const existing = statsByPlayer.get(playerId);
      if (!existing) {
        statsByPlayer.set(playerId, {
          player: playerInfo,
          vttlStats: team.competition === 'Vttl' ? { games, victories } : null,
          sportaStats: team.competition === 'Sporta' ? { games, victories } : null,
          vttlResultsByMatch: team.competition === 'Vttl' ? resultsByMatch : [],
          sportaResultsByMatch: team.competition === 'Sporta' ? resultsByMatch : [],
        });
      } else if (team.competition === 'Vttl') {
        if (existing.vttlStats) {
          existing.vttlStats.games += games;
          existing.vttlStats.victories += victories;
        } else {
          existing.vttlStats = { games, victories };
        }
        existing.vttlResultsByMatch.push(...resultsByMatch);
      } else if (team.competition === 'Sporta') {
        if (existing.sportaStats) {
          existing.sportaStats.games += games;
          existing.sportaStats.victories += victories;
        } else {
          existing.sportaStats = { games, victories };
        }
        existing.sportaResultsByMatch.push(...resultsByMatch);
      }
    });
  });

  return Array.from(statsByPlayer.values()).map(entry => {
    entry.vttlResultsByMatch.sort((a, b) => b.matchDate.valueOf() - a.matchDate.valueOf());
    entry.sportaResultsByMatch.sort((a, b) => b.matchDate.valueOf() - a.matchDate.valueOf());

    return {
      player: entry.player,
      vttl: entry.vttlStats,
      sporta: entry.sportaStats,
      vttlResults: entry.vttlResultsByMatch.flatMap(m => m.results),
      sportaResults: entry.sportaResultsByMatch.flatMap(m => m.results),
      recentResults: getRecentResults(entry.vttlResultsByMatch, entry.sportaResultsByMatch),
    };
  });
};

export const TeamPlayerPerformance = () => {
  const [showOtherPlayers, setShowOtherPlayers] = useState(false);
  const user = useTtcSelector(selectUser);
  const teams = useTtcSelector(selectTeams);
  const allMatches = useTtcSelector(selectMatches);
  const allPlayers = useTtcSelector(selectPlayers);

  const userTeams = teams.filter(team => user.teams.includes(team.id));

  if (userTeams.length === 0) {
    return null;
  }

  // Find all players that play in the user's teams
  const playerIdsInUserTeams = new Set<number>();
  userTeams.forEach(team => {
    const teamMatches = allMatches.filter(m => m.teamId === team.id && m.isSyncedWithFrenoy);
    teamMatches.forEach(match => {
      match.getGameMatches().forEach(game => {
        if (!game.isDoubles && 'playerId' in game.ownPlayer && game.ownPlayer.playerId) {
          playerIdsInUserTeams.add(game.ownPlayer.playerId);
        }
      });
    });
  });

  // Find all players that play in ANY team (for "other players")
  const allPlayerIdsInTeams = new Set<number>();
  teams.forEach(team => {
    const teamMatches = allMatches.filter(m => m.teamId === team.id && m.isSyncedWithFrenoy);
    teamMatches.forEach(match => {
      match.getGameMatches().forEach(game => {
        if (!game.isDoubles && 'playerId' in game.ownPlayer && game.ownPlayer.playerId) {
          allPlayerIdsInTeams.add(game.ownPlayer.playerId);
        }
      });
    });
  });

  // Other players = all players in teams minus players in user's teams
  const otherPlayerIds = new Set<number>();
  allPlayerIdsInTeams.forEach(id => {
    if (!playerIdsInUserTeams.has(id)) {
      otherPlayerIds.add(id);
    }
  });

  const playerStats = collectStatsForPlayers(playerIdsInUserTeams, allPlayers, teams, allMatches);
  const otherPlayerStats = showOtherPlayers
    ? collectStatsForPlayers(otherPlayerIds, allPlayers, teams, allMatches)
    : [];

  if (playerStats.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.teamPlayerPerformance')} style={{marginBottom: 6}} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15}}>
        {playerStats.map(stat => (
          <PlayerPerformanceCard
            key={stat.player.id}
            player={stat.player}
            vttl={stat.vttl}
            sporta={stat.sporta}
            vttlResults={stat.vttlResults}
            sportaResults={stat.sportaResults}
            recentResults={stat.recentResults}
            isCurrentUser={stat.player.id === user.playerId}
          />
        ))}
      </div>
      {otherPlayerIds.size > 0 && !showOtherPlayers && (
        <div style={{marginTop: 15, textAlign: 'center'}}>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowOtherPlayers(true)}>
            {t('dashboard.showOtherPlayers')}
          </Button>
        </div>
      )}
      {showOtherPlayers && otherPlayerStats.length > 0 && (
        <div style={{marginTop: 15}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15}}>
            {otherPlayerStats.map(stat => (
              <PlayerPerformanceCard
                key={stat.player.id}
                player={stat.player}
                vttl={stat.vttl}
                sporta={stat.sporta}
                vttlResults={stat.vttlResults}
                sportaResults={stat.sportaResults}
                recentResults={stat.recentResults}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
