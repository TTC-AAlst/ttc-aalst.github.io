import { IMatch, ITeamPlayerStats } from '../../../models/model-interfaces';
import { getMostTeamsParticipated } from './achievements/getMostTeamsParticipated';
import { getTeamUndefeatedStreak } from './achievements/getTeamUndefeatedStreak';
import { getUndefeatedStreak } from './achievements/getUndefeatedStreak';
import * as achievement from './achievements/otherAchievements';

const allAchievements: {[key: string]: ((playerStats: ITeamPlayerStats[], matches: IMatch[]) => achievement.AchievementInfo)[]} = {
  Vttl: [
    achievement.getHighestJumper.bind(this, 'Vttl'),
    getMostTeamsParticipated.bind(this, 'Vttl'),
    achievement.getMostMatchesWon,
    achievement.getMostMatchesPercentageWon.bind(this, 'Vttl'),
    achievement.getMostGamesPlayer,
    achievement.getRankingDestroyer.bind(this, 'Vttl'),
    achievement.getMostMatchesAllWon.bind(this, 'Vttl'),
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
];
