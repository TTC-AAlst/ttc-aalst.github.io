import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import OwnPlayer from '../Match/OwnPlayer';
import OpponentPlayer from '../Match/OpponentPlayer';
import { IndividualMatches } from '../Match/IndividualMatches';
import { MatchReport } from '../Match/MatchReport';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';

type MobileLiveMatchInProgressProps = {
  match: IMatch;
  opponentPlayersKnown: boolean;
};

export const MobileLiveMatchInProgress = ({
  match,
  opponentPlayersKnown,
}: MobileLiveMatchInProgressProps) => (
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
  const user = useTtcSelector(selectUser);

  const hasReportOrComments = !!match.description || match.comments.length > 0;
  const hasGames = match.games.length > 0;

  if (!hasGames) {
    return null;
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <ButtonGroup size="sm">
          <Button
            variant={showGames ? 'secondary' : 'outline-secondary'}
            onClick={() => setShowGames(!showGames)}
          >
            {t('match.tabs.matchesTitle')}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setShowReportModal(true)}
          >
            <Icon
              fa={hasReportOrComments ? 'fa fa-commenting-o' : 'fa fa-comment-o'}
            />
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
