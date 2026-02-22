import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button, ButtonGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import OwnPlayer from '../Match/OwnPlayer';
import OpponentPlayer from '../Match/OpponentPlayer';
import { IndividualMatches } from '../Match/IndividualMatches';
import { MatchReport } from '../Match/MatchReport';
import { OpponentsLastMatches } from '../Match/OpponentsLastMatches';
import { OpponentsFormation } from '../Match/OpponentsFormation';
import { OpponentsTeamFormation } from '../Match/OpponentsTeamFormation';
import { selectOpponentMatches } from '../../../reducers/selectors/selectOpponentMatches';
import { PreviousEncounters } from '../Match/PreviousEncounters';
import { Scoresheet } from '../Match/Scoresheet';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges';
import { Icon } from '../../controls/Icons/Icon';
import { EditIcon } from '../../controls/Icons/EditIcon';
import { t } from '../../../locales';
import { selectReadOnlyMatches, selectUser, useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { getOpponentMatches } from '../../../reducers/readonlyMatchesReducer';
import { DivisionMatchesSection } from './DivisionMatchesSection';
import { getPreviousEncounters } from '../../../reducers/matchInfoReducer';
import { OpponentPlayerSelector } from './OpponentPlayerSelector';
import { OwnPlayerSelector } from './OwnPlayerSelector';
import { TeamRankingBadges } from '../../teams/controls/TeamRankingBadges';
import { MatchOtherRoundButton } from '../controls/ViewMatchDetailsButton';
import { MatchCardAdmin } from '../Match/MatchCardAdmin';

type MobileLiveMatchInProgressProps = {
  match: IMatch;
};

export const MobileLiveMatchInProgress = ({ match }: MobileLiveMatchInProgressProps) => {
  const hasPlayersOrGames = match.games.length || match.getTheirPlayers().length;
  const hasStarted = match.date.isBefore(dayjs());
  const canEnterOpponents = match.date.subtract(1, 'hour').isBefore(dayjs());

  // Pre-start: show our formation and away match details
  if (!hasPlayersOrGames) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
        <OurFormationPreStart match={match} />
        {!match.isHomeMatch && !hasStarted && <AwayMatchDetails match={match} />}
        {canEnterOpponents && <OpponentPlayersPreStart match={match} />}
        <MatchActionButtons match={match} />
        {hasStarted && <MatchDetailsLink match={match} />}
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


const FormationsWithResults = ({ match }: { match: IMatch }) => {
  const [showEditOpponents, setShowEditOpponents] = useState(false);
  const [showEditOwn, setShowEditOwn] = useState(false);
  const user = useTtcSelector(selectUser);
  const canEditPlayers = match.games.length === 0;

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <SectionTitle>{t('match.playersVictoryTitle')}</SectionTitle>
            {canEditPlayers && user.playerId > 0 && (
              <EditIcon
                style={{ cursor: 'pointer' }}
                onClick={() => setShowEditOwn(!showEditOwn)}
              />
            )}
          </div>
          {match.getOwnPlayers().filter(ply => ply.status === match.block).map(ply => (
            <OwnPlayer key={ply.position} match={match} ply={ply} showRanking />
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <SectionTitle>{t('match.playersOpponentsTitle')}</SectionTitle>
            {canEditPlayers && (
              <EditIcon
                style={{ cursor: 'pointer' }}
                onClick={() => setShowEditOpponents(!showEditOpponents)}
              />
            )}
          </div>
          {match.getTheirPlayers().map(ply => (
            <OpponentPlayer key={ply.position} ply={ply} t={t} competition={match.competition} fullName={false} />
          ))}
        </div>
      </div>
      {showEditOwn && (
        <div style={{ marginTop: 16 }}>
          <OwnPlayerSelector match={match} initialOpen onClose={() => setShowEditOwn(false)} />
        </div>
      )}
      {showEditOpponents && (
        <div style={{ marginTop: 16 }}>
          <OpponentPlayerSelector match={match} initialOpen onClose={() => setShowEditOpponents(false)} />
        </div>
      )}
    </div>
  );
};

const MatchActionButtons = ({ match }: { match: IMatch }) => {
  const [showGames, setShowGames] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOpponentModal, setShowOpponentModal] = useState(false);
  const [showEncountersModal, setShowEncountersModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDivision, setShowDivision] = useState(false);
  const user = useTtcSelector(selectUser);
  const dispatch = useTtcDispatch();
  const opponentMatches = useTtcSelector(state => selectOpponentMatches(state, match));
  const opponentMatchesList = [...opponentMatches.home, ...opponentMatches.away];
  const readonlyMatches = useTtcSelector(selectReadOnlyMatches);

  const hasReportOrComments = !!match.description || match.comments.length > 0;
  const hasTheirPlayers = match.getTheirPlayers().length > 0;

  // Calculate today's division matches
  const team = match.getTeam();
  const competition = team.competition === 'Sporta' ? 'Sporta' : 'Vttl';
  const todayDivisionMatches = readonlyMatches
    .filter(m => m.competition === competition)
    .filter(m => m.frenoyDivisionId === team.frenoy.divisionId)
    .filter(m => m.shouldBePlayed && m.isBeingPlayed())
    .filter(m => !m.isOurMatch);

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
          <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.report')}</Tooltip>}>
            <Button variant="outline-secondary" onClick={() => setShowReportModal(true)}>
              <Icon fa={hasReportOrComments ? 'fa fa-commenting-o' : 'fa fa-comment-o'} />
            </Button>
          </OverlayTrigger>
          {match.games.length > 0 && (
            <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.matchesTitle')}</Tooltip>}>
              <Button variant={showGames ? 'secondary' : 'outline-secondary'} onClick={() => setShowGames(!showGames)}>
                {t('match.tabs.matches')}
              </Button>
            </OverlayTrigger>
          )}
          <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.opponentsFormationTitle')}</Tooltip>}>
            <Button variant="outline-secondary" onClick={() => setShowOpponentModal(true)}>
              {t('match.individual.opponentPlayer')}
            </Button>
          </OverlayTrigger>
          <MatchOtherRoundButton match={match} shortLabel small />
          {hasTheirPlayers && (
            <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.previousEncountersTitle')}</Tooltip>}>
              <Button variant="outline-secondary" onClick={() => setShowEncountersModal(true)}>
                {t('match.tabs.previousEncounters')}
              </Button>
            </OverlayTrigger>
          )}
          {todayDivisionMatches.length > 0 && (
            <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.division')}</Tooltip>}>
              <Button
                variant={showDivision ? 'secondary' : 'outline-secondary'}
                onClick={() => setShowDivision(!showDivision)}
              >
                {t('match.tabs.division')}
              </Button>
            </OverlayTrigger>
          )}
          {user.isDev() && (
            <Button variant="outline-secondary" aria-label="admin" onClick={() => setShowAdminModal(true)}>
              <Icon fa="fa fa-cog" />
            </Button>
          )}
        </ButtonGroup>
      </div>

      {showGames && (
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <IndividualMatches match={match} ownPlayerId={user.playerId} />
        </div>
      )}

      {showDivision && (
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <DivisionMatchesSection match={match} />
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
            <div style={{marginLeft: -6, marginTop: -8}}>
              <TeamRankingBadges team={match.getTeam()} opponent={match.opponent} small />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding: 6}}>
          <h4>{t('match.tabs.opponentsFormationTitle')}</h4>
          <OpponentsTeamFormation matches={opponentMatchesList} opponent={match.opponent} limitRows />

          <h4 style={{marginTop: 24}}>{t('teamCalendar.individual')}</h4>
          <OpponentsFormation match={match} opponent={match.opponent} />

          <h4 style={{marginTop: 24}}>{t('match.tabs.opponentsRankingTitle')}</h4>
          <OpponentsLastMatches match={match} />
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

      <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} fullscreen style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>admin</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding: 6}}>
          <MatchCardAdmin match={match} />
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
  const [showEditOwn, setShowEditOwn] = useState(false);
  const user = useTtcSelector(selectUser);
  const playingPlayers = match.getPlayerFormation('onlyFinal').map(x => x.player);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <SectionTitle>{t('match.tabs.playersTitle')}</SectionTitle>
          {playingPlayers.length > 0 && user.playerId > 0 && match.games.length === 0 && (
            <EditIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setShowEditOwn(!showEditOwn)}
            />
          )}
        </div>
        {playingPlayers.length > 0 && (
          <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.tabs.scoresheet')}</Tooltip>}>
            <Button
              size="sm"
              variant={showScoresheet ? 'secondary' : 'outline-secondary'}
              onClick={() => setShowScoresheet(!showScoresheet)}
            >
              <Icon fa="fa fa-table" />
            </Button>
          </OverlayTrigger>
        )}
      </div>
      {playingPlayers.length === 0 && user.playerId > 0 && (
        <OwnPlayerSelector match={match} />
      )}
      {playingPlayers.length === 0 && user.playerId <= 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666' }}>
          <Icon fa="fa fa-question-circle" />
          <span style={{ fontStyle: 'italic' }}>{t('match.formationUnknown')}</span>
        </div>
      )}
      {playingPlayers.length > 0 && showEditOwn && (
        <div style={{ marginBottom: 8 }}>
          <OwnPlayerSelector match={match} initialOpen onClose={() => setShowEditOwn(false)} />
        </div>
      )}
      {playingPlayers.length > 0 && showScoresheet && (
        <Scoresheet match={match} hideDownload />
      )}
      {playingPlayers.length > 0 && !showScoresheet && !showEditOwn && (
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

  return (
    <div>
      <SectionTitle>{t('match.tabs.clubTitle')}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!match.isStandardStartTime() && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon fa="fa fa-clock-o" />
            <span style={{ fontWeight: 600 }}>{match.date.format('HH:mm')}</span>
          </div>
        )}
        {loc?.address ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon fa="fa fa-map-marker" />
                <span style={{ fontWeight: 600 }}>{loc.description}</span>
              </div>
              <OverlayTrigger placement="top" overlay={<Tooltip>{t('match.navigateToClub')}</Tooltip>}>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address}, ${loc.postalCode} ${loc.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon fa="fa fa-location-arrow" />
                </Button>
              </OverlayTrigger>
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

const OpponentPlayersPreStart = ({ match }: { match: IMatch }) => {
  const canEdit = match.games.length === 0;

  return (
    <div>
      <SectionTitle>{t('match.theirFormation')}</SectionTitle>
      {canEdit ? (
        <OpponentPlayerSelector match={match} />
      ) : (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          {t('match.opponentPlayersLocked')}
        </div>
      )}
    </div>
  );
};
