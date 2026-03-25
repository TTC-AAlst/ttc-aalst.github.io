import { getRankingValue } from '../playerRankingValueMapper';
import rankingSorter, { PlayerRanking } from '../rankingSorter';

describe('getRankingValue', () => {
  describe('Vttl', () => {
    it('returns highest value for A', () => {
      expect(getRankingValue('Vttl', 'A')).toBe(18);
    });

    it('returns lowest value for NG', () => {
      expect(getRankingValue('Vttl', 'NG')).toBe(1);
    });

    it('returns correct mid-range values', () => {
      expect(getRankingValue('Vttl', 'C0')).toBe(13);
      expect(getRankingValue('Vttl', 'D6')).toBe(6);
    });

    it('returns 0 for unknown ranking', () => {
      expect(getRankingValue('Vttl', 'Z9')).toBe(0);
    });

    it('A > B0 > C0 > D0 > E0 > NG', () => {
      const values = ['A', 'B0', 'C0', 'D0', 'E0', 'NG'].map(r => getRankingValue('Vttl', r));
      for (let i = 0; i < values.length - 1; i++) {
        expect(values[i]!).toBeGreaterThan(values[i + 1]!);
      }
    });
  });

  describe('Jeugd uses Vttl values', () => {
    it('returns same values as Vttl', () => {
      expect(getRankingValue('Jeugd', 'A')).toBe(getRankingValue('Vttl', 'A'));
      expect(getRankingValue('Jeugd', 'D2')).toBe(getRankingValue('Vttl', 'D2'));
    });
  });

  describe('Sporta', () => {
    it('returns highest value for A', () => {
      expect(getRankingValue('Sporta', 'A')).toBe(19);
    });

    it('has F ranking between E6 and NG', () => {
      const f = getRankingValue('Sporta', 'F');
      const e6 = getRankingValue('Sporta', 'E6');
      const ng = getRankingValue('Sporta', 'NG');
      expect(f).toBeLessThan(e6);
      expect(f).toBeGreaterThan(ng);
    });

    it('returns 0 for unknown ranking', () => {
      expect(getRankingValue('Sporta', 'Z9')).toBe(0);
    });
  });
});

describe('rankingSorter', () => {
  it('sorts A before B0', () => {
    expect(rankingSorter('A', 'B0')).toBeLessThan(0);
  });

  it('sorts NG after all others', () => {
    expect(rankingSorter('NG', 'A')).toBeGreaterThan(0);
    expect(rankingSorter('NG', 'E6')).toBeGreaterThan(0);
  });

  it('returns 0 for equal rankings', () => {
    expect(rankingSorter('C4', 'C4')).toBe(0);
  });

  it('sorts an array of rankings correctly', () => {
    const rankings: PlayerRanking[] = ['D0', 'A', 'NG', 'B4', 'E6'];
    const sorted = [...rankings].sort(rankingSorter);
    expect(sorted).toEqual(['A', 'B4', 'D0', 'E6', 'NG']);
  });
});
