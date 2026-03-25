import { Link } from 'react-router-dom';
import cn from 'classnames';
import { Icon } from '../../controls/Icons/Icon';
import { DivisionRankingLabel, OurDivisionRankingLabel } from '../controls/DivisionRankingLabel';
import { IMatch, OwnTeamLink } from '../../../models/model-interfaces';
import { browseTo } from '../../../routes';
import { t } from '../../../locales';

type MatchVsProps = {
  match: IMatch;
  opponentOnly?: boolean;
  themOnly?: boolean;
  ownTeamLink?: OwnTeamLink;
  withLinks?: boolean;
  withPosition?: boolean;
};

const MatchVs = ({ match, opponentOnly = false, themOnly = false, ownTeamLink, withLinks, withPosition = true }: MatchVsProps) => {
  const team = match.getTeam();
  const divisionRanking = team.getDivisionRanking(match.opponent);
  let them = (
    <span>
      {withPosition && !divisionRanking.empty ? <DivisionRankingLabel divisionRanking={divisionRanking} /> : null}

      {withLinks ? (
        <Link className="link-hover-underline" to={browseTo.getOpponent(match.competition, match.opponent)}>
          {match.renderOpponentTitle()}
        </Link>
      ) : (
        match.renderOpponentTitle()
      )}
    </span>
  );

  if (!divisionRanking.empty && divisionRanking.isForfait) {
    them = <s>{them}</s>;
  }

  if (themOnly) {
    return <span>{them}</span>;
  }

  const usClasses = cn('badge label-as-badge bg-info', { clickable: !!ownTeamLink });
  let us;
  if (ownTeamLink) {
    us = (
      <Link to={browseTo.getTeam(team, ownTeamLink)} className={usClasses}>
        <OurDivisionRankingLabel team={team} />
        <span style={{ fontSize: 14 }}>{team.renderOwnTeamTitle()}</span>
      </Link>
    );
  } else {
    us = (
      <span className={usClasses} style={{ fontSize: 14 }}>
        <OurDivisionRankingLabel team={team} />
        {team.renderOwnTeamTitle()}
      </span>
    );
  }

  if (!match.shouldBePlayed) {
    return us;
  }

  if (opponentOnly) {
    return (
      <span>
        {match.isHomeMatch ? <Icon fa="fa fa-home" style={{ marginRight: 5 }} tooltip={t('common.matchAtHome')} /> : null}
        {them}
      </span>
    );
  }

  const separator = <Icon fa="fa fa-arrows-h" />;
  if (match.isHomeMatch) {
    return (
      <span>
        {us} {separator} {them}
      </span>
    );
  }
  return (
    <span>
      {them} {separator} {us}
    </span>
  );
};

export default MatchVs;
