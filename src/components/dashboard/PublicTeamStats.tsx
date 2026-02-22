import React from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Strike } from '../controls/controls/Strike';
import { TeamPosition } from '../teams/controls/TeamPosition';
import { selectMatchesBeingPlayed, selectTeams, useTtcSelector } from '../../utils/hooks/storeHooks';
import { browseTo } from '../../routes';
import { IMatch, ITeam } from '../../models/model-interfaces';
import t from '../../locales';
import { Icon } from '../controls/Icons/Icon';

const getTeamLatestMatch = (team: ITeam): IMatch | undefined => {
  const matches = team.getMatches();

  // First check if there's a match being played
  const beingPlayed = matches.find(m => m.isBeingPlayed());
  if (beingPlayed) {
    return beingPlayed;
  }

  // Otherwise get the most recent played match (synced with Frenoy)
  const playedMatches = matches
    .filter(m => m.isSyncedWithFrenoy && m.scoreType !== 'WalkOver')
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  return playedMatches[0];
};

const getScoreColors = (match: IMatch): { bg: string; hoverBg: string } => {
  const { score, isHomeMatch, isDerby } = match;

  if (!score || isDerby) {
    return { bg: '#6BCBFF', hoverBg: '#49bfff' }; // won
  }

  if (score.home === score.out) {
    return { bg: '#FF9E4F', hoverBg: '#ff8b2d' }; // draw
  }

  const won = isHomeMatch ? score.home > score.out : score.out > score.home;
  return won
    ? { bg: '#6BCBFF', hoverBg: '#49bfff' }  // won
    : { bg: '#FF5144', hoverBg: '#ff3122' }; // lost
};

const ScoreButton = ({ match }: { match: IMatch }) => {
  const colors = getScoreColors(match);

  return (
    <Link
      to={t.route('match', {matchId: match.id})}
      className="btn"
      style={{
        width: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.95em',
        fontWeight: 'bold',
        textDecoration: 'none',
        backgroundColor: colors.bg,
        borderColor: colors.bg,
        color: 'white',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = colors.hoverBg;
        e.currentTarget.style.borderColor = colors.hoverBg;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = colors.bg;
        e.currentTarget.style.borderColor = colors.bg;
      }}
    >
      {match.score ? `${match.score.home} - ${match.score.out}` : '-'}
    </Link>
  );
};

const CompactTeamCard = ({ team }: { team: ITeam }) => {
  const ranking = team.getDivisionRanking();
  const latestMatch = getTeamLatestMatch(team);

  if (ranking.empty) {
    return null;
  }

  return (
    <div style={{display: 'flex', alignItems: 'stretch', gap: 8, marginBottom: 4}}>
      <Link
        to={browseTo.getTeam(team)}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          flex: 1,
          padding: 6,
          backgroundColor: '#fafafa',
          borderRadius: 4,
          border: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85em',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <TeamPosition team={team} style={{marginRight: 4, marginTop: 0, fontSize: '0.9em'}} />
          <span>{team.renderOwnTeamTitle()}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: '1.2em'}}>
          <span style={{color: '#4CAF50', marginRight: 4}}><Icon fa="fa fa-thumbs-up" style={{marginRight: 2}} />{ranking.gamesWon}</span>
          <span style={{color: '#FF9800', marginRight: 4}}><Icon fa="fa fa-meh-o" style={{marginRight: 2}} />{ranking.gamesDraw}</span>
          <span style={{color: '#f44336'}}><Icon fa="fa fa-thumbs-down" style={{marginRight: 2}} />{ranking.gamesLost}</span>
        </div>
      </Link>
      {latestMatch ? (
        <ScoreButton match={latestMatch} />
      ) : (
        <div
          className="btn btn-secondary disabled"
          style={{
            width: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          -
        </div>
      )}
    </div>
  );
};

export const PublicTeamStats = () => {
  const teams = useTtcSelector(selectTeams);
  const matchesBeingPlayed = useTtcSelector(selectMatchesBeingPlayed);

  const vttlTeams = teams.filter(team => team.competition === 'Vttl' && !team.getDivisionRanking().empty);
  const sportaTeams = teams.filter(team => team.competition === 'Sporta' && !team.getDivisionRanking().empty);

  if (vttlTeams.length === 0 && sportaTeams.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6}}>
        <Strike text={t('dashboard.globalTeamStats')} style={{flex: 1, marginBottom: 0}} />
        {matchesBeingPlayed.length > 0 && (
          <Link to={t.route('matchesToday')}>
            <Button variant="success" size="sm" style={{whiteSpace: 'nowrap'}}>
              {t('dashboard.matchesBeingPlayed', {count: matchesBeingPlayed.length})}
            </Button>
          </Link>
        )}
      </div>
      <Row>
        <Col md={6}>
          {vttlTeams.map(team => (
            <CompactTeamCard key={team.id} team={team} />
          ))}
        </Col>
        <Col md={6}>
          {sportaTeams.map(team => (
            <CompactTeamCard key={team.id} team={team} />
          ))}
        </Col>
      </Row>
    </div>
  );
};
