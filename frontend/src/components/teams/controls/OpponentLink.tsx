import React from 'react';
import { Link } from 'react-router-dom';
import storeUtil from '../../../storeUtil';
import { DivisionRankingLabel } from '../../matches/controls/DivisionRankingLabel';
import { OwnClubId } from '../../../models/ClubModel';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';
import { browseTo } from '../../../routes';

type OpponentLinkProps = {
  team: ITeam;
  opponent: ITeamOpponent;
  withPosition?: boolean,
}

export const OpponentLink = ({withPosition = true, team, opponent}: OpponentLinkProps) => {
  const club = storeUtil.getClub(opponent.clubId);
  let teamTitle: any = `${club?.name || 'Unknown'} ${opponent.teamCode || ''}`;
  if (opponent.clubId !== OwnClubId && browseTo.getOpponent(team.competition, opponent) !== document.location.pathname) {
    teamTitle = (
      <Link className="link-hover-underline" to={browseTo.getOpponent(team.competition, opponent)}>
        {teamTitle}
      </Link>
    );
  }

  const divisionRanking = team.getDivisionRanking(opponent);
  if (divisionRanking.empty || divisionRanking.isForfait) {
    return <s>{teamTitle}</s>;
  }

  return (
    <span>
      {withPosition ? <DivisionRankingLabel divisionRanking={divisionRanking} /> : null}
      {teamTitle}
    </span>
  );
};
