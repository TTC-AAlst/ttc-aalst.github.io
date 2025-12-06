import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import MatchForm from '../Match/MatchForm';
import { MatchScore } from '../MatchScore';
import { ViewMatchDetailsButton } from '../controls/ViewMatchDetailsButton';
import { IMatch, ITeamOpponent } from '../../../models/model-interfaces';
import { IUser } from '../../../models/UserModel';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { browseTo } from '../../../routes';
import t from '../../../locales';

type MobileLiveMatchHeaderProps = {
  match: IMatch;
};

export const MobileLiveMatchHeader = ({ match }: MobileLiveMatchHeaderProps) => {
  const user = useTtcSelector(selectUser);
  const team = match.getTeam();

  const getRanking = (opponent?: ITeamOpponent) => {
    const ranking = team.getDivisionRanking(opponent);
    return ranking.empty ? null : ranking;
  };

  const homeRanking = getRanking(match.isHomeMatch ? undefined : match.opponent);
  const awayRanking = getRanking(match.isHomeMatch ? match.opponent : undefined);

  const ownTeamLink = browseTo.getTeam(team, 'main');
  const opponentLink = browseTo.getOpponent(match.competition, match.opponent);

  const renderOwnTeam = () => (
    <Link to={ownTeamLink} className="link-hover-underline">
      {team.renderOwnTeamTitle()}
    </Link>
  );

  const renderOpponentTeam = () => (
    <Link to={opponentLink} className="link-hover-underline">
      {match.renderOpponentTitle()}
    </Link>
  );

  const thrillerType = team.getThriller(match);

  return (
    <div
      style={{
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {thrillerType && <CornerRibbon type={thrillerType} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ fontWeight: match.isHomeMatch ? 'bold' : 'normal', fontSize: '1.1em' }}>
            {homeRanking && <small className="match-opponent-team">{homeRanking.position}. </small>}
            {match.isHomeMatch ? renderOwnTeam() : renderOpponentTeam()}
          </div>
          <div style={{ color: '#888', fontSize: '0.85em', margin: '4px 0' }}>
            {t('match.vs')}
          </div>
          <div style={{ fontWeight: !match.isHomeMatch ? 'bold' : 'normal', fontSize: '1.1em' }}>
            {awayRanking && <small className="match-opponent-team">{awayRanking.position}. </small>}
            {match.isHomeMatch ? renderOpponentTeam() : renderOwnTeam()}
          </div>
        </div>

        <div style={{ marginLeft: 12 }}>
          <MatchScoreOrForm match={match} user={user} />
        </div>
      </div>
    </div>
  );
};

const CornerRibbon = ({ type }: { type: 'topMatch' | 'degradationMatch' }) => {
  const isTop = type === 'topMatch';
  const backgroundColor = isTop ? '#e74c3c' : '#e67e22';
  const label = isTop ? 'Topper' : 'Thriller';

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: -27,
        backgroundColor,
        color: 'white',
        fontSize: '0.85em',
        fontWeight: 'bold',
        padding: '2px 36px',
        transform: 'rotate(-45deg)',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        zIndex: 1,
      }}
    >
      {label}
    </div>
  );
};

const MatchScoreOrForm = ({ match, user }: { match: IMatch; user: IUser }) => {
  const hasStarted = match.date.isBefore(moment());

  if (!hasStarted) {
    return <ViewMatchDetailsButton match={match} size="sm" />;
  }

  if (!match.isSyncedWithFrenoy) {
    return <MatchForm match={match} user={user} />;
  }

  return <MatchScore match={match} forceDisplay style={{ fontSize: 26 }} />;
};
