import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import OwnPlayer from '../Match/OwnPlayer';
import OpponentPlayer from '../Match/OpponentPlayer';
import { IndividualMatches } from '../Match/IndividualMatches';
import { MatchReport } from '../Match/MatchReport';
import { OpponentsLastMatches } from '../Match/OpponentsLastMatches';
import { OpponentsFormation } from '../Match/OpponentsFormation';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { selectUser, useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { getOpponentMatches } from '../../../reducers/readonlyMatchesReducer';

type MobileLiveMatchInProgressProps = {
  match: IMatch;
  opponentPlayersKnown: boolean;
};

export const MobileLiveMatchInProgress = ({
  match,
  opponentPlayersKnown,
}: MobileLiveMatchInProgressProps) => {
  const hasStarted = moment().isAfter(match.date);

  // Pre-start: show our formation and away match details
  if (!hasStarted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
        <OurFormationPreStart match={match} />
        {!match.isHomeMatch && <AwayMatchDetails match={match} />}
        <MatchActionButtons match={match} />
      </div>
    );
  }

  // Match in progress or finished
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {opponentPlayersKnown ? (
        <>
          <FormationsWithResults match={match} />
          <MatchActionButtons match={match} />
        </>
      ) : (
        <WaitingForResults />
      )}
      {!match.isSyncedWithFrenoy && <MatchDetailsLink match={match} />}
    </div>
  );
};

const WaitingForResults = () => (
  <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
    <div style={{ fontSize: '1.2em', marginBottom: 8 }}>Match bezig...</div>
    <div style={{ fontSize: '0.9em' }}>
      Wachten op individuele uitslagen van Frenoy
    </div>
  </div>
);

const FormationsWithResults = ({ match }: { match: IMatch }) => (
  <div style={{ display: 'flex', gap: 16, padding: 8 }}>
    <div style={{ flex: 1 }}>
      <SectionTitle>{t('match.playersVictoryTitle')}</SectionTitle>
      {match.getOwnPlayers().map(ply => (
        <OwnPlayer key={ply.position} match={match} ply={ply} />
      ))}
    </div>
    <div style={{ flex: 1 }}>
      <SectionTitle>{t('match.playersOpponentsTitle')}</SectionTitle>
      {match.getTheirPlayers().map(ply => (
        <OpponentPlayer key={ply.position} ply={ply} t={t} competition={match.competition} fullName={false} />
      ))}
    </div>
  </div>
);

const MatchActionButtons = ({ match }: { match: IMatch }) => {
  const [showGames, setShowGames] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOpponentModal, setShowOpponentModal] = useState(false);
  const user = useTtcSelector(selectUser);
  const dispatch = useTtcDispatch();

  const hasReportOrComments = !!match.description || match.comments.length > 0;

  useEffect(() => {
    dispatch(getOpponentMatches({ teamId: match.teamId, opponent: match.opponent }));
  }, [dispatch, match.teamId, match.opponent]);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <ButtonGroup size="sm">
          <Button
            variant="outline-secondary"
            onClick={() => setShowReportModal(true)}
          >
            <Icon fa={hasReportOrComments ? 'fa fa-commenting-o' : 'fa fa-comment-o'} />
          </Button>
          <Button
            variant={showGames ? 'secondary' : 'outline-secondary'}
            onClick={() => setShowGames(!showGames)}
          >
            {t('match.tabs.matches')}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setShowOpponentModal(true)}
          >
            {t('match.individual.opponentPlayer')}
          </Button>
        </ButtonGroup>
      </div>

      {showGames && (
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <IndividualMatches match={match} ownPlayerId={user.playerId} />
        </div>
      )}

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} fullscreen style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>
            {match.getTeam().renderOwnTeamTitle()} vs {match.renderOpponentTitle()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding: 6}}>
          <MatchReport match={match} skipContainerClass />
        </Modal.Body>
      </Modal>

      <Modal show={showOpponentModal} onHide={() => setShowOpponentModal(false)} fullscreen style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>
            {match.renderOpponentTitle()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding: 6}}>
          <h4>{t('match.tabs.opponentsRankingTitle')}</h4>
          <OpponentsLastMatches match={match} />
          <h4 style={{marginTop: 24}}>{t('match.tabs.opponentsFormationTitle')}</h4>
          <OpponentsFormation match={match} opponent={match.opponent} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

const MatchDetailsLink = ({ match }: { match: IMatch }) => (
  <div style={{ textAlign: 'center', marginTop: 4 }}>
    <Link
      to={t.route('match').replace(':matchId', match.id.toString())}
      style={{ color: '#007bff', fontSize: '0.9em' }}
    >
      {t('match.details')} &rarr;
    </Link>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontWeight: 600,
      fontSize: '0.85em',
      color: '#666',
      marginBottom: 8,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const OurFormationPreStart = ({ match }: { match: IMatch }) => {
  const playingPlayers = match.getPlayerFormation('onlyFinal').map(x => x.player);

  return (
    <div>
      <SectionTitle>{t('match.tabs.playersTitle')}</SectionTitle>
      {playingPlayers.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {playingPlayers.map(ply => (
            <PlayerCompetitionBadge
              key={ply.id}
              plyInfo={{ player: ply, matchPlayer: { status: 'Major' } }}
              competition={match.competition}
              style={{ marginBottom: 0 }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
          <Icon fa="fa fa-question-circle" />
          <span style={{ fontStyle: 'italic' }}>{t('match.formationUnknown')}</span>
        </div>
      )}
    </div>
  );
};

const AwayMatchDetails = ({ match }: { match: IMatch }) => {
  const club = match.getOpponentClub();
  const loc = club?.mainLocation;
  const startHour = match.date.format('HH:mm');
  const isNonDefaultTime = startHour !== '19:30' && startHour !== '14:00';

  return (
    <div>
      <SectionTitle>{t('match.tabs.clubTitle')}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isNonDefaultTime && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon fa="fa fa-clock-o" />
            <span style={{ fontWeight: 600 }}>{startHour}</span>
          </div>
        )}
        {loc?.address ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon fa="fa fa-map-marker" style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>{loc.description}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address}, ${loc.postalCode} ${loc.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    fontSize: '0.8em',
                    color: 'black',
                    border: '1px solid black',
                    borderRadius: 4,
                    textDecoration: 'none',
                  }}
                >
                  <Icon fa="fa fa-location-arrow" />
                  Route
                </a>
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {loc.address}, {loc.postalCode} {loc.city}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            {t('match.club.locationUnknown')}
          </div>
        )}
      </div>
    </div>
  );
};
