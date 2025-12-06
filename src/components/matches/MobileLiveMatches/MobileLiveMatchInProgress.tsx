import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { IMatch } from '../../../models/model-interfaces';
import OwnPlayer from '../Match/OwnPlayer';
import OpponentPlayer from '../Match/OpponentPlayer';
import { IndividualMatches } from '../Match/IndividualMatches';
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
        <IndividualGamesToggle match={match} />
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

const IndividualGamesToggle = ({ match }: { match: IMatch }) => {
  const [showGames, setShowGames] = useState(false);
  const user = useTtcSelector(selectUser);

  if (match.games.length === 0) {
    return null;
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setShowGames(!showGames)}
        >
          {showGames ? t('match.report.viewDetails') : t('match.tabs.matchesTitle')}
        </Button>
      </div>
      {showGames && (
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <IndividualMatches match={match} ownPlayerId={user.playerId} />
        </div>
      )}
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
