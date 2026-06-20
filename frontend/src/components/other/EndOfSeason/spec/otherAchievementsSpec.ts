import { vi } from 'vitest';
import { getHighestJumper } from '../achievements/otherAchievements';
import { Competition, ITeamPlayerStats } from '../../../../models/model-interfaces';

// otherAchievements imports storeUtil at module load; break the store import cycle.
vi.mock('../../../../storeUtil', () => ({ default: {} }));

const makeStat = (alias: string, ranking: string, nextRanking: string): ITeamPlayerStats =>
  ({
    ply: { alias, getCompetition: () => ({ ranking, nextRanking }) },
  }) as unknown as ITeamPlayerStats;

const aliases = (competition: Competition, stats: ITeamPlayerStats[]) => getHighestJumper(competition, stats).players.map(p => p.player.alias);

describe('getHighestJumper (Rising Star)', () => {
  it('counts a Vttl NG -> E6 climb as one classification (F does not exist in Vttl)', () => {
    // NG -> E6 (real 1 step in Vttl) must tie with E4 -> E2 (also 1 step),
    // not beat it by phantom-stepping over the Sporta-only "F".
    const result = aliases('Vttl', [makeStat('Patrick', 'NG', 'E6'), makeStat('Other', 'E4', 'E2')]);
    expect(result).toEqual(['Patrick', 'Other']);
  });

  it('still counts the Sporta-only F: NG -> E6 is two steps there', () => {
    // Sporta has NG < F < E6, so NG -> E6 (2 steps) beats F -> E6 (1 step).
    const result = aliases('Sporta', [makeStat('TwoStep', 'NG', 'E6'), makeStat('OneStep', 'F', 'E6')]);
    expect(result).toEqual(['TwoStep']);
  });
});
