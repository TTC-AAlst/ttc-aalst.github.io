import { Dayjs } from 'dayjs';
import { PlayerRanking } from '../../../models/utils/rankingSorter';
import { IMatch, ITeam } from '../../../models/model-interfaces';

const rankings: PlayerRanking[] = ['A', 'B0', 'B2', 'B4', 'B6', 'C0', 'C2', 'C4', 'C6', 'D0', 'D2', 'D4', 'D6', 'E0', 'E2', 'E4', 'E6', 'F', 'NG'];

export type GameResult = {
  won: boolean;
  playerRanking: PlayerRanking;
  opponentRanking: PlayerRanking;
};

export type MatchGameResults = {
  matchId: number;
  matchDate: Dayjs;
  results: GameResult[];
};

export type PlayerGameResultsSummary = {
  allResults: GameResult[];
  recentResults: GameResult[];
};

/**
 * Collect game results for a player from a list of matches, grouped by match
 */
export const collectPlayerGameResultsByMatch = (
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

/**
 * Get recent results from the last 2 matches per competition
 */
export const getRecentResults = (
  vttlResultsByMatch: MatchGameResults[],
  sportaResultsByMatch: MatchGameResults[],
): GameResult[] => {
  // Get results from last 2 Vttl matches (4 games each = 8 games max)
  const recentVttl = vttlResultsByMatch.slice(0, 2).flatMap(m => m.results);
  // Get results from last 2 Sporta matches (3 games each = 6 games max)
  const recentSporta = sportaResultsByMatch.slice(0, 2).flatMap(m => m.results);

  return [...recentVttl, ...recentSporta];
};

/**
 * Collect all game results for a player across both competitions
 */
export const collectPlayerPerformanceData = (
  playerId: number,
  vttlRanking: PlayerRanking | undefined,
  sportaRanking: PlayerRanking | undefined,
  allMatches: IMatch[],
  teams: ITeam[],
): PlayerGameResultsSummary => {
  const vttlMatches = allMatches.filter(m => {
    const team = teams.find(x => x.id === m.teamId);
    return team?.competition === 'Vttl';
  });
  const sportaMatches = allMatches.filter(m => {
    const team = teams.find(x => x.id === m.teamId);
    return team?.competition === 'Sporta';
  });

  const vttlResultsByMatch = collectPlayerGameResultsByMatch(playerId, vttlRanking, vttlMatches);
  const sportaResultsByMatch = collectPlayerGameResultsByMatch(playerId, sportaRanking, sportaMatches);

  const allResults = [
    ...vttlResultsByMatch.flatMap(m => m.results),
    ...sportaResultsByMatch.flatMap(m => m.results),
  ];
  const recentResults = getRecentResults(vttlResultsByMatch, sportaResultsByMatch);

  return { allResults, recentResults };
};

/**
 * Get the ranking index (lower = better)
 */
export const getRankingIndex = (ranking: PlayerRanking): number => rankings.indexOf(ranking);

/**
 * Get the ranking difference (positive = opponent is better, negative = opponent is weaker)
 */
export const getRankingDifference = (playerRanking: PlayerRanking, opponentRanking: PlayerRanking): number => {
  const playerIdx = getRankingIndex(playerRanking);
  const opponentIdx = getRankingIndex(opponentRanking);
  return playerIdx - opponentIdx; // positive means opponent is better ranked
};

/**
 * Expected win probability based on ranking difference
 * More realistic model:
 * - Same ranking: 50%
 * - 1 level higher opponent: 35%
 * - 2 levels higher: 25%
 * - 3 levels higher: 15%
 * - 4+ levels higher: 10% (losses ignored in performance calc)
 * - 1 level lower: 65%
 * - 2 levels lower: 75%
 * - 3+ levels lower: 85%
 */
const getExpectedWinProbability = (diff: number): number => {
  // diff > 0 means opponent is better (higher ranked)
  if (diff >= 4) return 0.10;
  if (diff === 3) return 0.15;
  if (diff === 2) return 0.25;
  if (diff === 1) return 0.35;
  if (diff === 0) return 0.50;
  if (diff === -1) return 0.65;
  if (diff === -2) return 0.75;
  return 0.85; // diff <= -3
};

/**
 * Check if a loss should be ignored (opponent 4+ levels higher)
 */
const shouldIgnoreLoss = (result: GameResult): boolean => {
  if (result.won) return false;
  const diff = getRankingDifference(result.playerRanking, result.opponentRanking);
  return diff >= 4; // Ignore losses against opponents 4+ levels higher
};

/**
 * Calculate weighted score for a game result
 * Wins against higher ranked players worth more, losses against lower ranked players penalized more
 */
export const calculateGameWeight = (result: GameResult): number => {
  const diff = getRankingDifference(result.playerRanking, result.opponentRanking);
  // diff > 0 means opponent is better (higher ranked)
  // diff < 0 means opponent is weaker (lower ranked)

  if (result.won) {
    // Win: base 1 point, bonus for beating higher ranked
    // Bigger bonus for higher ranked opponents
    if (diff >= 3) return 2.0; // Excellent win
    if (diff === 2) return 1.5; // Very good win
    if (diff === 1) return 1.25; // Good win
    return 1.0; // Expected win
  }

  // Loss: ignore if opponent is 4+ levels higher
  if (diff >= 4) return 0; // Ignored loss

  // Penalty for losing to lower ranked
  if (diff <= -3) return -0.75; // Bad loss
  if (diff === -2) return -0.5;
  if (diff === -1) return -0.25;
  return 0; // Expected loss (same level or higher opponent)
};

export type PerformanceBadgeType = 'on-fire' | 'solid' | 'on-track' | 'rising' | 'struggling' | 'neutral';

export type PerformanceBadgeInfo = {
  type: PerformanceBadgeType;
  label: string;
  color: string;
  icon: string;
};

/**
 * Calculate performance badge based on:
 * 1. Performance vs expected (based on opponent rankings)
 * 2. Recent trend (last 2 matches per competition)
 */
export const calculatePerformanceBadge = (
  allResults: GameResult[],
  recentResults: GameResult[],
): PerformanceBadgeInfo => {
  if (allResults.length < 3) {
    return { type: 'neutral', label: 'Nieuw', color: '#9E9E9E', icon: 'fa-question' };
  }

  // Filter out ignored losses for performance calculation
  const countedResults = allResults.filter(r => !shouldIgnoreLoss(r));
  const countedRecent = recentResults.filter(r => !shouldIgnoreLoss(r));

  if (countedResults.length < 3) {
    return { type: 'neutral', label: 'Nieuw', color: '#9E9E9E', icon: 'fa-question' };
  }

  // Calculate overall weighted performance
  const overallScore = countedResults.reduce((acc, r) => acc + calculateGameWeight(r), 0);
  const overallAvg = overallScore / countedResults.length;

  // Calculate recent weighted performance
  const recentScore = countedRecent.reduce((acc, r) => acc + calculateGameWeight(r), 0);
  const recentAvg = countedRecent.length > 0 ? recentScore / countedRecent.length : overallAvg;

  // Calculate expected vs actual wins (using realistic probabilities)
  const expectedWins = countedResults.reduce((acc, r) => {
    const diff = getRankingDifference(r.playerRanking, r.opponentRanking);
    return acc + getExpectedWinProbability(diff);
  }, 0);
  const actualWins = countedResults.filter(r => r.won).length;
  const performanceVsExpected = actualWins - expectedWins;

  // Determine thresholds
  const isTrendingUp = recentAvg > overallAvg + 0.15;
  const isTrendingDown = recentAvg < overallAvg - 0.15;
  const isAboveExpected = performanceVsExpected > 1.5;
  const isOnTrack = Math.abs(performanceVsExpected) <= 1.5;
  const isBelowExpected = performanceVsExpected < -1.5;

  // Badge assignment (in priority order)
  if (isAboveExpected && (isTrendingUp || recentAvg > 0.6)) {
    return { type: 'on-fire', label: 'On Fire', color: '#FF5722', icon: 'fa-fire' };
  }

  if (isAboveExpected) {
    return { type: 'solid', label: 'Sterk', color: '#4CAF50', icon: 'fa-rocket' };
  }

  if (isTrendingUp && !isBelowExpected) {
    return { type: 'rising', label: 'Stijgend', color: '#2196F3', icon: 'fa-road' };
  }

  if (isBelowExpected || isTrendingDown) {
    return { type: 'struggling', label: 'Lastig', color: '#FF9800', icon: 'fa-battery-half' };
  }

  if (isOnTrack) {
    return { type: 'on-track', label: 'On Track', color: '#8BC34A', icon: 'fa-shield' };
  }

  return { type: 'on-track', label: 'Stabiel', color: '#9E9E9E', icon: 'fa-minus' };
};
