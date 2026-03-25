import React from 'react';
import { Badgy } from '../../controls/Icons/ThrillerIcon';
import { Icon } from '../../controls/Icons/Icon';
import { ITeam, ITeamOpponent, ITeamRanking } from '../../../models/model-interfaces';
import { t } from '../../../locales';

type TeamRankingBadgesProps = {
  team: ITeam;
  opponent?: ITeamOpponent;
  style?: React.CSSProperties;
  small?: boolean;
};

export const TeamRankingBadges = ({ team, opponent, ...props }: TeamRankingBadgesProps) => {
  const ranking = team.getDivisionRanking(opponent);
  if (ranking.empty) {
    return null;
  }

  return <TeamRankingBadgesCore ranking={ranking} {...props} />;
};

type TeamRankingBadgesCoreProps = {
  ranking: ITeamRanking;
  style?: React.CSSProperties;
  small?: boolean;
};

const TeamRankingBadgesCore = ({ ranking, small, style }: TeamRankingBadgesCoreProps) => {
  const defaultStyle = small ? { fontSize: 18 } : { fontSize: 26 };
  const badgeMargin = small ? 6 : 12;
  const m = badgeMargin;
  return (
    <div style={{ display: 'inline', ...(style || defaultStyle) }}>
      <TeamOverviewBadge amount={ranking.gamesWon} type="match-won" fa="fa-thumbs-up" tooltip="matchesWonBadge" m={m} />
      <TeamOverviewBadge amount={ranking.gamesDraw} type="match-draw" fa="fa-meh-o" tooltip="matchesDrawBadge" m={m} />
      <TeamOverviewBadge amount={ranking.gamesLost} type="match-lost" fa="fa-thumbs-down" tooltip="matchesLostBadge" m={m} />
    </div>
  );
};

const TeamOverviewBadge = ({ amount, type, fa, tooltip, m }: TeamOverviewBadgeProps) => (
  <Badgy type={type} style={{ marginLeft: m }} tooltip={t(`teamCalendar.${tooltip}`)}>
    <Icon fa={`fa ${fa}`} style={{ marginRight: 4 }} />
    {amount}
  </Badgy>
);

type TeamOverviewBadgeProps = {
  amount: number;
  type: string;
  fa: string;
  tooltip: string;
  m: number;
};
