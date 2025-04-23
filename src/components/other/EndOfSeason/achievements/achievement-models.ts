import { ITeam } from "../../../../models/model-interfaces";

export type TeamAchievementInfo = {
  title: string;
  desc: string;
  teams: {
    throphy: string;
    team: ITeam;
  }[];
}
