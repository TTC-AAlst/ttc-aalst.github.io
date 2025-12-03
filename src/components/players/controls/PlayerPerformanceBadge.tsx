import React from 'react';
import { Icon } from '../../controls/Icons/Icon';
import { GameResult, calculatePerformanceBadge, PerformanceBadgeInfo } from './PlayerPerformanceUtils';

type PlayerPerformanceBadgeProps = {
  allResults: GameResult[];
  recentResults: GameResult[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
};

const sizeMap = {
  sm: { fontSize: '0.7em', padding: '2px 6px' },
  md: { fontSize: '0.8em', padding: '3px 8px' },
  lg: { fontSize: '0.9em', padding: '4px 10px' },
};

export const PlayerPerformanceBadge = ({
  allResults,
  recentResults,
  size = 'md',
  showLabel = true,
}: PlayerPerformanceBadgeProps) => {
  const badge = calculatePerformanceBadge(allResults, recentResults);
  const { fontSize, padding } = sizeMap[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: `${badge.color}20`,
        color: badge.color,
        padding,
        borderRadius: 12,
        fontSize,
        fontWeight: 500,
      }}
      title={getBadgeTooltip(badge, allResults, recentResults)}
    >
      <Icon fa={`fa ${badge.icon}`} style={{ marginRight: showLabel ? 4 : 0 }} />
      {showLabel && badge.label}
    </span>
  );
};

const getBadgeTooltip = (
  badge: PerformanceBadgeInfo,
  allResults: GameResult[],
  recentResults: GameResult[],
): string => {
  const totalWins = allResults.filter(r => r.won).length;
  const totalGames = allResults.length;
  const recentWins = recentResults.filter(r => r.won).length;
  const recentGames = recentResults.length;

  const winsVsHigher = allResults.filter(r => r.won && isHigherRanked(r)).length;
  const lossesVsLower = allResults.filter(r => !r.won && isLowerRanked(r)).length;

  let tooltip = `${badge.label}: ${totalWins}/${totalGames} gewonnen`;
  if (recentGames > 0) {
    tooltip += ` (recent: ${recentWins}/${recentGames})`;
  }
  if (winsVsHigher > 0) {
    tooltip += `\n${winsVsHigher}x gewonnen tegen hoger geklasseerd`;
  }
  if (lossesVsLower > 0) {
    tooltip += `\n${lossesVsLower}x verloren tegen lager geklasseerd`;
  }
  return tooltip;
};

const rankings = ['A', 'B0', 'B2', 'B4', 'B6', 'C0', 'C2', 'C4', 'C6', 'D0', 'D2', 'D4', 'D6', 'E0', 'E2', 'E4', 'E6', 'F', 'NG'];

const isHigherRanked = (result: GameResult): boolean => {
  const playerIdx = rankings.indexOf(result.playerRanking);
  const opponentIdx = rankings.indexOf(result.opponentRanking);
  return opponentIdx < playerIdx; // lower index = higher ranked
};

const isLowerRanked = (result: GameResult): boolean => {
  const playerIdx = rankings.indexOf(result.playerRanking);
  const opponentIdx = rankings.indexOf(result.opponentRanking);
  return opponentIdx > playerIdx;
};
