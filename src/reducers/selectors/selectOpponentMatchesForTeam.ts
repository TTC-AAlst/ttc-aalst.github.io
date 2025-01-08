import { createSelector } from "@reduxjs/toolkit";
import { Competition } from "../../models/model-interfaces";
import { selectReadOnlyMatches } from "../../utils/hooks/storeHooks";

export const selectOpponentMatchesForTeam = createSelector(
  [
    selectReadOnlyMatches,
    (_, competition: Competition) => competition,
    (_, competition: Competition, clubId: number) => clubId,
    (_, competition: Competition, clubId: number, teamCode: string | undefined) => teamCode,
  ],
  (matches, competition, clubId, teamCode) => {
    const matchesCompetition = competition === 'Sporta' ? 'Sporta' : 'Vttl';
    return matches.filter(m => m.competition === matchesCompetition)
      .filter(m => m.home && m.away)
      .filter(m => !teamCode || (m.home.clubId === clubId && m.home.teamCode === teamCode) || (m.away.clubId === clubId && m.away.teamCode === teamCode))
      .filter(m => m.shouldBePlayed)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  },
);
