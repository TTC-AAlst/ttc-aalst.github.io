import { createSelector } from "@reduxjs/toolkit";
import { IMatch, ITeamOpponent } from "../../models/model-interfaces";
import { selectReadOnlyMatches } from "../../utils/hooks/storeHooks";

export const selectOpponentMatches = createSelector(
  [
    selectReadOnlyMatches,
    (_, match: IMatch) => match,
    (_, __: IMatch, opponentIn?: ITeamOpponent) => opponentIn,
  ],
  (readOnlyMatches, match, opponentIn) => {
    const opponent = opponentIn || match.opponent;
    const matches = readOnlyMatches
      .filter(x => x.competition === match.competition && x.frenoyDivisionId === match.frenoyDivisionId);

    return {
      home: matches.filter(m => m.home.clubId === opponent.clubId && (!opponent.teamCode || m.home.teamCode === opponent.teamCode)),
      away: matches.filter(m => m.away.clubId === opponent.clubId && (!opponent.teamCode || m.away.teamCode === opponent.teamCode)),
    };
  },
);
