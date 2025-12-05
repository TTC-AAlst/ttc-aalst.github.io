import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMatch } from '../../../models/model-interfaces';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges';
import { PlayerRankings } from '../controls/MatchPlayerRankings';
import { Spinner } from '../../controls/controls/Spinner';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { useTtcDispatch, useTtcSelector, selectReadOnlyMatches } from '../../../utils/hooks/storeHooks';
import { getOpponentMatches } from '../../../reducers/readonlyMatchesReducer';
import storeUtil, { getMatchPlayerRankings } from '../../../storeUtil';

type MobileLiveMatchPreStartProps = {
  match: IMatch;
};

export const MobileLiveMatchPreStart = ({ match }: MobileLiveMatchPreStartProps) => {
  const dispatch = useTtcDispatch();

  useEffect(() => {
    dispatch(getOpponentMatches({ teamId: match.teamId, opponent: match.opponent }));
  }, [dispatch, match.teamId, match.opponent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <OurFormation match={match} />
      {!match.isHomeMatch && <AwayMatchDetails match={match} />}
      <OpponentLastResults match={match} />
      <MatchDetailsLink match={match} />
    </div>
  );
};

const OurFormation = ({ match }: { match: IMatch }) => {
  const team = match.getTeam();
  const playingPlayers = match.getPlayerFormation('onlyFinal').map(x => x.player);

  if (playingPlayers.length === 0) {
    const standardPlayers = team.getPlayers('standard').map(ply => ply.player);
    if (standardPlayers.length === 0) {
      return null;
    }
    return (
      <div>
        <SectionTitle>{t('match.tabs.playersTitle')}</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {standardPlayers.map(ply => (
            <PlayerCompetitionBadge
              key={ply.id}
              plyInfo={{ player: ply, matchPlayer: {status: 'Major'}}}
              competition={match.competition}
              style={{ marginBottom: 0 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>{t('match.tabs.playersTitle')}</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {playingPlayers.map(ply => (
          <PlayerCompetitionBadge
            key={ply.id}
            plyInfo={{ player: ply, matchPlayer: {status: 'Major'}}}
            competition={match.competition}
            style={{ marginBottom: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

const OpponentLastResults = ({ match }: { match: IMatch }) => {
  const allReadOnlyMatches = useTtcSelector(selectReadOnlyMatches);

  const isOpponent = (opp: { clubId: number; teamCode: string }) => (
    opp.clubId === match.opponent.clubId && opp.teamCode === match.opponent.teamCode
  );

  const readonlyMatches = allReadOnlyMatches
    .filter(m => isOpponent(m.home) || isOpponent(m.away))
    .filter(m => m.competition === match.competition && m.frenoyDivisionId === match.frenoyDivisionId)
    .filter(m => m.score && (m.score.home || m.score.out))
    .filter(m => m.id !== match.id)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 3);

  if (readonlyMatches.length === 0) {
    return (
      <div>
        <SectionTitle>{t('match.tabs.opponentsRankingTitle')}</SectionTitle>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>{t('match.tabs.opponentsRankingTitle')}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {readonlyMatches.map(m => {
          const isHomeMatch = m.home.clubId === match.opponent.clubId && m.home.teamCode === match.opponent.teamCode;
          const won = m.won(match.opponent);
          const formation = getMatchPlayerRankings(m, isHomeMatch);

          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                backgroundColor: won ? 'rgba(40, 167, 69, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 4,
                fontSize: '0.9em',
              }}
            >
              <span style={{ flex: 1 }}>
                {isHomeMatch
                  ? `${storeUtil.getClub(m.away.clubId)?.name || '?'} ${m.away.teamCode}`
                  : `${storeUtil.getClub(m.home.clubId)?.name || '?'} ${m.home.teamCode}`}
              </span>
              <span style={{ marginRight: 8, color: '#666', fontSize: '0.85em' }}>
                <PlayerRankings formation={formation} />
              </span>
              <span style={{ fontWeight: 'bold', minWidth: 40, textAlign: 'right' }}>
                {m.score.home} - {m.score.out}
              </span>
            </div>
          );
        })}
      </div>
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
            <div>
              <div style={{ fontWeight: 600 }}>{loc.description}</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {loc.address}, {loc.postalCode} {loc.city}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address}, ${loc.postalCode} ${loc.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85em' }}
              >
                Open in Maps
              </a>
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
