import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { IMatch, IMatchPlayer } from '../../../models/model-interfaces';
import { matchOutcome } from '../../../models/MatchModel';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges';
import { ThumbsUpIcon } from '../../controls/Icons/ThumbsIcons';
import { TrophyIcon } from '../../controls/Icons/TrophyIcon';
import { IndividualMatches } from '../Match/IndividualMatches';
import { t } from '../../../locales';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import storeUtil from '../../../storeUtil';

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

const FormationsWithResults = ({ match }: { match: IMatch }) => {
  const ownPlayers = match.getOwnPlayers();
  const theirPlayers = match.getTheirPlayers();
  const teamPlayerCount = match.getTeam().getTeamPlayerCount();

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Our team */}
      <div style={{ flex: 1 }}>
        <SectionTitle>{t('match.playersVictoryTitle')}</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ownPlayers.map(ply => (
            <OurPlayerRow
              key={ply.position}
              match={match}
              ply={ply}
              teamPlayerCount={teamPlayerCount}
            />
          ))}
        </div>
      </div>

      {/* Their team */}
      <div style={{ flex: 1 }}>
        <SectionTitle>{t('match.playersOpponentsTitle')}</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {theirPlayers.map(ply => (
            <TheirPlayerRow key={ply.position} ply={ply} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OurPlayerRow = ({ match, ply, teamPlayerCount }: { match: IMatch; ply: IMatchPlayer; teamPlayerCount: number }) => {
  const player = storeUtil.getPlayer(ply.playerId);
  const result = getPlayerResults(match, ply);

  if (result.wo) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <s style={{ color: '#999' }}>{ply.alias}</s>
      </div>
    );
  }

  const allWon = result.wins === teamPlayerCount;
  const showWins = result.wins > 0 && result.wins < teamPlayerCount;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {player ? (
        <PlayerCompetitionBadge
          plyInfo={{ player, matchPlayer: { status: ply.status } }}
          competition={match.competition}
          style={{ marginBottom: 0 }}
        />
      ) : (
        <span style={{ fontWeight: 500 }}>{ply.alias}</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {allWon && <TrophyIcon />}
        {showWins && (
          <>
            <ThumbsUpIcon />
            <span style={{ fontSize: '0.85em', color: '#28a745' }}>{result.wins}</span>
          </>
        )}
      </div>
    </div>
  );
};

const TheirPlayerRow = ({ ply }: { ply: IMatchPlayer }) => (
  <div
    style={{
      padding: '4px 0',
      fontSize: '0.9em',
    }}
  >
    <span>{ply.alias}</span>
    <span style={{ color: '#666' }}> ({ply.ranking})</span>
    {ply.won ? (
      <span style={{ color: '#666' }}>: {t('match.enemyVictory', ply.won)}</span>
    ) : null}
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
      <div style={{ textAlign: 'center' }}>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setShowGames(!showGames)}
        >
          {showGames ? t('match.report.viewDetails') : t('match.tabs.matchesTitle')}
        </Button>
      </div>
      {showGames && (
        <div style={{ marginTop: 12 }}>
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

function getPlayerResults(match: IMatch, ply: IMatchPlayer) {
  const plyMatches = match.getGameMatches().filter(game => game.ownPlayer === ply);

  if (plyMatches.every(game => game.outcome === 'WalkOver')) {
    return { wins: 0, losses: 0, wo: true };
  }

  const wins = plyMatches.filter(game => game.outcome === matchOutcome.Won).length;
  const losses = plyMatches.filter(game => game.outcome === matchOutcome.Lost).length;

  return { wins, losses, wo: false };
}
