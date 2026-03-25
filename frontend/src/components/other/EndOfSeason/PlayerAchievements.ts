import { IMatch, ITeamPlayerStats } from '../../../models/model-interfaces';
import { getCleanSweepTeams } from './achievements/getCleanSweepTeams';
import { getClutchMaster } from './achievements/getClutchMaster';
import { getMostTeamsParticipated } from './achievements/getMostTeamsParticipated';
import { getPerfectFormation } from './achievements/getPerfectFormation';
import { getTeamHighestWinPercentage } from './achievements/getTeamHighestWinPercentage';
import { getTeamMostCloseWins } from './achievements/getTeamMostCloseWins';
import { getTeamUndefeatedStreak } from './achievements/getTeamUndefeatedStreak';
import { getUndefeatedStreak } from './achievements/getUndefeatedStreak';
import * as achievement from './achievements/otherAchievements';

// TODO: List of possible achievements that can still be added

// Players
// 🚗 De Reiziger: "Meeste uitwedstrijden gespeeld"

// Dubbels
// Beste dubbel partners: meest dubbel wedstrijden gewonnen
// Doubles Clutcher: Beste dubbel partner: speler met meest gewonnen dubbels

// Belles
// These are only possible if we start to also keep track of the sets, which is only possible for Vttl
// 🤬 Net Niet: meeste verloren belles met het kleinste verschil
// 👻 Tiebreak Terror: "Meeste belles gespeeld die eindigden in 11–9 of 12–10"
// 🧷 Speld op de draad – spannend en precies: meeste gewonnen belles met het kleinste verschil
// 🔙 Comeback King: "Meeste belles gewonnen na 0–2 achterstand"

// Team
// 🧱 "Onverslaanbaar Thuis": Team met de meeste thuisoverwinningen
// ✈️ "Uitploeg van het Jaar": Meeste overwinningen op verplaatsing
// 😤 "Comeback Kings": Winst behaald na minstens 3–0 achterstand(games)
// 🎯 "Clutch Factor": Team dat de meeste beslissende matchen won(laatste game beslist match)
// 🔁 "Revanche!": Team dat een tegenstander versloeg na eerder dat seizoen te hebben verloren
// 🧙 "Consistency is Key": Team dat het vaakst won met dezelfde score(bv. 12–4 of 7–3)


const allAchievements: {[key: string]: ((playerStats: ITeamPlayerStats[], matches: IMatch[]) => achievement.AchievementInfo)[]} = {
  Vttl: [
    achievement.getHighestJumper.bind(this, 'Vttl'),
    getMostTeamsParticipated.bind(this, 'Vttl'),
    achievement.getMostMatchesWon,
    achievement.getMostMatchesPercentageWon.bind(this, 'Vttl'),
    achievement.getMostGamesPlayer,
    achievement.getRankingDestroyer.bind(this, 'Vttl'),
    achievement.getMostMatchesAllWon.bind(this, 'Vttl'),
    getClutchMaster.bind(this, 'Vttl'),
    getUndefeatedStreak.bind(this, 'Vttl'),
    achievement.getMostNetjesTegen,
  ],
  Sporta: [
    achievement.getHighestJumper.bind(this, 'Sporta'),
    getMostTeamsParticipated.bind(this, 'Sporta'),
    achievement.getMostMatchesWon,
    achievement.getMostMatchesPercentageWon.bind(this, 'Sporta'),
    achievement.getMostGamesPlayer,
    achievement.getRankingDestroyer.bind(this, 'Sporta'),
    achievement.getMostMatchesAllWon.bind(this, 'Sporta'),
    getClutchMaster.bind(this, 'Sporta'),
    getUndefeatedStreak.bind(this, 'Sporta'),
  ],
  belles: [
    achievement.getMostBellesWon,
    achievement.getMostBellesPercentageWon,
    achievement.getMostBellesPercentageLost,
    achievement.getMostBellesPlayed,
  ],
};

export default allAchievements;

export const teamAchievements = [
  getTeamUndefeatedStreak,
  getTeamHighestWinPercentage,
  getPerfectFormation,
  getTeamMostCloseWins,
  getCleanSweepTeams,
];
