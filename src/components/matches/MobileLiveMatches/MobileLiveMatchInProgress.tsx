import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { IMatch, IMatchPlayer } from '../../../models/model-interfaces';
import { matchOutcome } from '../../../models/MatchModel';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges';
import { ThumbsUpIcon, ThumbsDownIcon } from '../../controls/Icons/ThumbsIcons';
import { TrophyIcon } from '../../controls/Icons/TrophyIcon';
import { t } from '../../../locales';
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
        <IndividualGames match={match} />
      </>
    ) : (
      <WaitingForResults />
    )}
    <MatchDetailsLink match={match} />
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 8px',
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: 4,
    }}
  >
    <span style={{ fontSize: '0.9em' }}>{ply.alias}</span>
    <span style={{ fontSize: '0.85em', color: '#666' }}>{ply.ranking}</span>
    {ply.won ? (
      <span style={{ fontSize: '0.85em', color: '#666' }}>
        {t('match.enemyVictory', ply.won)}
      </span>
    ) : null}
  </div>
);

const IndividualGames = ({ match }: { match: IMatch }) => {
  if (match.games.length === 0) {
    return null;
  }

  let homeScore = 0;
  let outScore = 0;

  return (
    <div>
      <SectionTitle>{t('match.tabs.matchesTitle')}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {match.getGameMatches()
          .sort((a, b) => a.matchNumber - b.matchNumber)
          .map(game => {
            if (game.homeSets > game.outSets) {
              homeScore++;
            } else {
              outScore++;
            }

            const isDouble = game.isDoubles;
            const won = game.outcome === matchOutcome.Won;

            return (
              <div
                key={game.matchNumber}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  backgroundColor: won ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.05)',
                  borderRadius: 4,
                  fontSize: '0.9em',
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {won && <TrophyIcon style={{ marginRight: 4 }} />}
                  <span className={cn({ 'font-weight-bold': won })}>
                    {isDouble ? t('match.double') : game.home.alias}
                  </span>
                </div>
                {!isDouble && (
                  <span style={{ color: '#666', flex: 1, textAlign: 'center' }}>
                    {game.out.alias}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#666', fontSize: '0.85em' }}>
                    {game.homeSets}-{game.outSets}
                  </span>
                  <span style={{ fontWeight: 'bold', minWidth: 32, textAlign: 'right' }}>
                    {homeScore}-{outScore}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
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
