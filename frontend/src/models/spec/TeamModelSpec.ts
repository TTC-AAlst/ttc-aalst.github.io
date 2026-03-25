import { getPlayerStats } from '../TeamModel';
import MatchModel from '../MatchModel';
import { IMatch } from '../model-interfaces';

// const teamJson = {
//   id: 0,
//   competition: '',
//   opponents: [],
//   players: [],
//   ranking: [],
//   year: 2017,
//   frenoy: {}
// };

describe('TeamModel', () => {
  describe('getPlayerStats', () => {
    let matches: IMatch[];

    beforeEach(() => {
      matches = [
        new MatchModel({
          isHomeMatch: true,
          opponent: {},
          comments: [],
          players: [{
            playerId: 1,
            name: 'ply1',
            uniqueIndex: 1,
            ranking: 'D6',
          }, {
            playerId: 2,
            name: 'ply2',
            uniqueIndex: 2,
            ranking: 'D2',
          }, {
            name: 'opp1',
            uniqueIndex: -1,
            ranking: 'E6',
          }, {
            name: 'opp2',
            uniqueIndex: -2,
            ranking: 'E2',
          }],
          games: [{
            homePlayerUniqueIndex: 1,
            outPlayerUniqueIndex: -1,
            outcome: 'Won',
          }, {
            homePlayerUniqueIndex: 1,
            outPlayerUniqueIndex: -1,
            outcome: 'Lost',
          }, {
            homePlayerUniqueIndex: 1,
            outPlayerUniqueIndex: -1,
            outcome: 'Lost',
          }, {
            homePlayerUniqueIndex: 2,
            outPlayerUniqueIndex: -1,
            outcome: 'Lost',
            homePlayerSets: 2, // belle
          }, {
            homePlayerUniqueIndex: 2,
            outPlayerUniqueIndex: -2,
            outcome: 'Won',
            outPlayerSets: 2, // belle
          }],
        }),
      ];
    });

    it('should calculate wins/losses against opponent rankings', () => {
      const result = getPlayerStats(matches);
      expect(result[0].won.E6).toBe(1);
      expect(result[0].lost.E6).toBe(2);

      expect(result[1].lost.E6).toBe(1);
      expect(result[1].won.E2).toBe(1);
    });

    it('should count player total games played', () => {
      const result = getPlayerStats(matches);
      expect(result[0].games).toBe(3);
      expect(result[1].games).toBe(2);
    });

    it('should count player victories', () => {
      const result = getPlayerStats(matches);
      expect(result[0].victories).toBe(1);
      expect(result[1].victories).toBe(1);
    });

    describe('belles', () => {
      it('should not calculate them by default', () => {
        const result = getPlayerStats(matches);
        expect(result[0].belles).toEqual({});
      });

      it('should count belles if told so', () => {
        const result = getPlayerStats(matches, true);
        expect(Object.keys(result[1].belles).length).toBe(2);
      });

      it('should count belles per player ranking', () => {
        const result = getPlayerStats(matches, true);
        expect(result[1].belles.E2).toEqual({won: 1, lost: 0});
        expect(result[1].belles.E6).toEqual({won: 0, lost: 1});
      });

      it('should count calc belle totals', () => {
        const result = getPlayerStats(matches, true);
        expect(result[1].belleGames).toBe(2);
        expect(result[1].belleVictories).toBe(1);
      });
    });
  });
});
