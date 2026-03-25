import {Competition} from '../model-interfaces';

const vttlRankingValues = {
  A: 18,
  B0: 17,
  B2: 16,
  B4: 15,
  B6: 14,
  C0: 13,
  C2: 12,
  C4: 11,
  C6: 10,
  D0: 9,
  D2: 8,
  D4: 7,
  D6: 6,
  E0: 5,
  E2: 4,
  E4: 3,
  E6: 2,
  NG: 1,
};

const sportaRankingValues = {
  A: 19,
  B0: 18,
  B2: 17,
  B4: 16,
  B6: 15,
  C0: 14,
  C2: 13,
  C4: 12,
  C6: 11,
  D0: 10,
  D2: 9,
  D4: 8,
  D6: 7,
  E0: 6,
  E2: 5,
  E4: 4,
  E6: 3,
  F: 2,
  NG: 1,
};

export const getRankingValue = (competition: Competition, ranking: string): number => {
  if (competition === 'Vttl' || competition === 'Jeugd') {
    return vttlRankingValues[ranking];
  }
  return sportaRankingValues[ranking];
};
