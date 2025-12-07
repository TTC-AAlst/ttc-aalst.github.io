import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { TrophyIcon } from '../controls/Icons/TrophyIcon';
import { ThrillerIcon } from '../controls/Icons/ThrillerIcon';
import { t } from '../../locales';
import { IMatch } from '../../models/model-interfaces';
import { selectMatches, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { getPlayerFormation } from './MatchesTable/matchesTableUtil';

const matchesToShow = 10;

type GroupedMatches = {
  date: string;
  dateDisplay: string;
  matches: IMatch[];
};

const isMatchHidden = (match: IMatch): boolean => {
  // Hide walkover matches
  if (match.scoreType === 'WalkOver') return true;
  // Hide forfeit matches
  const divisionRanking = match.getTeam().getDivisionRanking(match.opponent);
  if (!divisionRanking.empty && divisionRanking.isForfait) return true;
  return false;
};

const isDefaultStartTime = (match: IMatch): boolean => {
  const hour = match.date.format('HH:mm');
  return hour === '19:30' || hour === '14:00' || hour === '20:00';
};

const groupMatchesByDate = (matches: IMatch[]): GroupedMatches[] => {
  const groups: { [key: string]: IMatch[] } = {};
  matches.filter(m => !isMatchHidden(m)).forEach(match => {
    const dateKey = match.date.format('YYYY-MM-DD');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(match);
  });

  return Object.entries(groups).map(([date, matchList]) => ({
    date,
    dateDisplay: matchList[0].date.format('dd D MMM'),
    matches: matchList.sort((a, b) => a.date.valueOf() - b.date.valueOf()),
  }));
};

export const Matches = () => {
  const ownMatches = useTtcSelector(selectMatches);
  const today = moment();
  const todayRef = useRef<HTMLDivElement>(null);

  const matchesToday = ownMatches
    .filter(cal => cal.date.isSame(today, 'day'))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const matchesNext = ownMatches
    .filter(cal => cal.date.isAfter(today, 'day'))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .slice(0, matchesToShow);

  const matchesPlayed = ownMatches
    .filter(cal => cal.date.isBefore(today, 'day'))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, matchesToShow)
    .reverse();

  const pastGroups = groupMatchesByDate(matchesPlayed);
  const todayGroup = matchesToday.length > 0 ? groupMatchesByDate(matchesToday)[0] : null;
  const futureGroups = groupMatchesByDate(matchesNext);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px 16px' }}>
      {/* Past matches */}
      {pastGroups.map(group => (
        <DayCard key={group.date} group={group} isPast />
      ))}

      {/* Today marker */}
      <div ref={todayRef}>
        <TodayMarker hasMatchesToday={matchesToday.length > 0} />
      </div>

      {/* Today's matches */}
      {todayGroup && <DayCard group={todayGroup} isToday />}

      {/* Future matches */}
      {futureGroups.map(group => (
        <DayCard key={group.date} group={group} />
      ))}
    </div>
  );
};

const TodayMarker = ({ hasMatchesToday }: { hasMatchesToday: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
    <div style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: '#e74c3c',
      boxShadow: '0 0 8px rgba(231, 76, 60, 0.5)',
      flexShrink: 0,
    }}
    />
    <div style={{
      flex: 1,
      height: 2,
      backgroundColor: '#e74c3c',
      display: 'flex',
      alignItems: 'center',
    }}
    >
      <span style={{
        backgroundColor: 'white',
        padding: '0 8px',
        marginLeft: 8,
        color: '#e74c3c',
        fontWeight: 600,
        fontSize: '0.85em',
        textTransform: 'uppercase',
      }}
      >
        {hasMatchesToday ? t('match.todayMatches') : 'Vandaag'}
      </span>
    </div>
  </div>
);

type DayCardProps = {
  group: GroupedMatches;
  isPast?: boolean;
  isToday?: boolean;
};

const getScoreBackgroundColor = (won: boolean, isDraw: boolean) => {
  if (won) return '#d4edda';
  if (isDraw) return '#fff3cd';
  return '#f8d7da';
};

const getDotColor = (isToday: boolean, isPast: boolean) => {
  if (isToday) return '#e74c3c';
  if (isPast) return '#bdc3c7';
  return '#3498db';
};

const DayCard = ({ group, isPast, isToday }: DayCardProps) => {
  const user = useTtcSelector(selectUser);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Date header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
      }}
      >
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: getDotColor(!!isToday, !!isPast),
          flexShrink: 0,
        }}
        />
        <span style={{
          fontWeight: 600,
          fontSize: '0.9em',
          color: isToday ? '#e74c3c' : '#666',
          textTransform: 'uppercase',
          marginLeft: 8,
        }}
        >
          {group.dateDisplay}
        </span>
      </div>

      {/* Matches list */}
      <div style={{
        marginLeft: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderLeft: '2px solid #ecf0f1',
        paddingLeft: 12,
      }}
      >
        {group.matches.map(match => (
          <MatchRow
            key={match.id}
            match={match}
            isPast={isPast}
            isToday={isToday}
            userId={user.playerId}
          />
        ))}
      </div>
    </div>
  );
};

type MatchRowProps = {
  match: IMatch;
  isPast?: boolean;
  isToday?: boolean;
  userId?: number;
};

const getCardBackground = (isToday: boolean, isPast: boolean) => {
  if (isToday) return '#fff5f5';
  if (isPast) return '#fafafa';
  return '#fff';
};

const getCardBorder = (userPlays: boolean, isToday: boolean) => {
  if (userPlays) return '2px solid #4CAF50';
  if (isToday) return '1px solid #e74c3c';
  return '1px solid #e0e0e0';
};

const MatchRow = ({ match, isPast, isToday, userId }: MatchRowProps) => {
  const team = match.getTeam();
  const thriller = team.getThriller(match);
  const hasScore = match.score && (match.score.home !== 0 || match.score.out !== 0);
  const won = hasScore && (
    (match.isHomeMatch && match.score.home > match.score.out)
    || (!match.isHomeMatch && match.score.out > match.score.home)
  );
  const isDraw = hasScore && match.score.home === match.score.out;

  // Check if user plays in this match
  const formation = getPlayerFormation(match);
  const userPlaysInMatch = userId && formation.some(p => p.id === userId);

  // Get division rankings
  const ownRanking = team.getDivisionRanking();
  const ownRankingPos = !ownRanking.empty ? ownRanking.position : null;
  const opponentRanking = team.getDivisionRanking(match.opponent);
  const opponentRankingPos = !opponentRanking.empty ? opponentRanking.position : null;

  const ownTeamTitle = team.renderOwnTeamTitle();
  const opponentTitle = match.renderOpponentTitle();

  // Formation rankings for future matches
  const showFormation = !isPast && !hasScore && formation.length > 0;

  // Hide time for default start times on future matches
  const showTime = !hasScore && !isDefaultStartTime(match);

  return (
    <Link
      to={t.route('match', { matchId: match.id })}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{
        backgroundColor: getCardBackground(!!isToday, !!isPast),
        border: getCardBorder(!!userPlaysInMatch, !!isToday),
        borderRadius: 8,
        padding: '10px 14px',
        opacity: isPast ? 0.7 : 1,
        cursor: 'pointer',
      }}
      >
        {/* Teams and score */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}
        >
          {/* Teams column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {thriller && (
              <div style={{ marginBottom: 4 }}>
                <ThrillerIcon color={thriller === 'topMatch' ? 'red' : 'orange'} />
              </div>
            )}
            {/* Own team */}
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {ownRankingPos && <small style={{ color: '#888', fontWeight: 400 }}>{ownRankingPos}. </small>}
              <span>{ownTeamTitle}</span>
            </div>
            {/* vs */}
            <div style={{ color: '#888', fontSize: '0.85em', marginBottom: 2 }}>vs</div>
            {/* Opponent */}
            <div style={{ fontWeight: 600 }}>
              {opponentRankingPos && <small style={{ color: '#888', fontWeight: 400 }}>{opponentRankingPos}. </small>}
              <span>{opponentTitle}</span>
            </div>
          </div>

          {/* Score or time */}
          <div style={{ flexShrink: 0 }}>
            {hasScore && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 4,
                backgroundColor: getScoreBackgroundColor(!!won, isDraw),
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
              >
                {won && <TrophyIcon style={{ fontSize: '0.9em' }} />}
                <span>{match.score.home} - {match.score.out}</span>
              </div>
            )}
            {!hasScore && showTime && (
              <span style={{ color: '#888', fontSize: '0.85em' }}>
                {match.date.format('HH:mm')}
              </span>
            )}
          </div>
        </div>

        {/* Formation for future matches */}
        {showFormation && (
          <div style={{
            marginTop: 6,
            fontSize: '0.8em',
            color: '#666',
          }}
          >
            {formation.map((ply, i) => {
              const ranking = ply.player?.getCompetition(match.competition)?.ranking;
              return (
                <span key={ply.id}>
                  {ply.player?.alias || 'Unknown'}
                  {ranking && <small style={{ opacity: 0.7 }}> ({ranking})</small>}
                  {i < formation.length - 1 && ', '}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
};

