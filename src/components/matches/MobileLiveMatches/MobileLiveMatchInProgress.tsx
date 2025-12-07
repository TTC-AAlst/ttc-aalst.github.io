import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import OwnPlayer from '../Match/OwnPlayer';
import OpponentPlayer from '../Match/OpponentPlayer';
import { IndividualMatches } from '../Match/IndividualMatches';
import { MatchReport } from '../Match/MatchReport';
import { OpponentsLastMatches } from '../Match/OpponentsLastMatches';
import { OpponentsFormation } from '../Match/OpponentsFormation';
import { PreviousEncounters } from '../Match/PreviousEncounters';
import { Scoresheet } from '../Match/Scoresheet';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { selectUser, useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { getOpponentMatches } from '../../../reducers/readonlyMatchesReducer';
import { getPreviousEncounters } from '../../../reducers/matchInfoReducer';

type MobileLiveMatchInProgressProps = {
  match: IMatch;
};

export const MobileLiveMatchInProgress = ({ match }: MobileLiveMatchInProgressProps) => {
  const hasStarted = match.games.length || match.getTheirPlayers().length;

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
      <FormationsWithResults match={match} />
      <MatchActionButtons match={match} />
      {!match.isSyncedWithFrenoy && <MatchDetailsLink match={match} />}
    </div>
  );
};


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
  const [showEncountersModal, setShowEncountersModal] = useState(false);
  const user = useTtcSelector(selectUser);
  const dispatch = useTtcDispatch();

  const hasReportOrComments = !!match.description || match.comments.length > 0;
  const hasTheirPlayers = match.getTheirPlayers().length > 0;

  useEffect(() => {
    dispatch(getOpponentMatches({ teamId: match.teamId, opponent: match.opponent }));
  }, [dispatch, match.teamId, match.opponent]);

  useEffect(() => {
    if (hasTheirPlayers) {
      dispatch(getPreviousEncounters(match));
    }
  }, [dispatch, match, hasTheirPlayers]);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <ButtonGroup size="sm">
          <Button variant="outline-secondary" onClick={() => setShowReportModal(true)}>
            <Icon fa={hasReportOrComments ? 'fa fa-commenting-o' : 'fa fa-comment-o'} />
          </Button>
          {match.games.length > 0 && (
            <Button variant={showGames ? 'secondary' : 'outline-secondary'} onClick={() => setShowGames(!showGames)}>
              {t('match.tabs.matches')}
            </Button>
          )}
          <Button variant="outline-secondary" onClick={() => setShowOpponentModal(true)}>
            {t('match.individual.opponentPlayer')}
          </Button>
          {hasTheirPlayers && (
            <Button variant="outline-secondary" onClick={() => setShowEncountersModal(true)}>
              {t('match.tabs.previousEncounters')}
            </Button>
          )}
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

      <Modal show={showEncountersModal} onHide={() => setShowEncountersModal(false)} fullscreen style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>
            {t('match.tabs.previousEncountersTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding: 6}}>
          <PreviousEncounters match={match} />
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
  const [showScoresheet, setShowScoresheet] = useState(false);
  const playingPlayers = match.getPlayerFormation('onlyFinal').map(x => x.player);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <SectionTitle>{t('match.tabs.playersTitle')}</SectionTitle>
        {playingPlayers.length > 0 && (
          <Button
            size="sm"
            variant={showScoresheet ? 'secondary' : 'outline-secondary'}
            onClick={() => setShowScoresheet(!showScoresheet)}
          >
            <Icon fa="fa fa-table" />
          </Button>
        )}
      </div>
      {playingPlayers.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
          <Icon fa="fa fa-question-circle" />
          <span style={{ fontStyle: 'italic' }}>{t('match.formationUnknown')}</span>
        </div>
      )}
      {playingPlayers.length > 0 && showScoresheet && (
        <Scoresheet match={match} />
      )}
      {playingPlayers.length > 0 && !showScoresheet && (
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon fa="fa fa-map-marker" />
                <span style={{ fontWeight: 600 }}>{loc.description}</span>
              </div>
              <Button
                size="sm"
                variant="outline-secondary"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address}, ${loc.postalCode} ${loc.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon fa="fa fa-location-arrow" />
              </Button>
            </div>
            <div style={{ fontSize: '0.9em', color: '#666', marginLeft: 17, textTransform: 'capitalize' }}>
              {loc.address}, {loc.postalCode} {loc.city}
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
