import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { Strike } from '../controls/controls/Strike';
import { UpcomingMatchMiniView } from './UpcomingMatchMiniView';
import { selectMatches, selectPlayers, selectUser, selectUserTeams, useTtcSelector } from '../../utils/hooks/storeHooks';
import { useViewport } from '../../utils/hooks/useViewport';
import t from '../../locales';

export const DashboardUpcomingMatches = () => {
  const matches = useTtcSelector(selectMatches);
  const userTeams = useTtcSelector(selectUserTeams);
  const user = useTtcSelector(selectUser);
  const players = useTtcSelector(selectPlayers);
  const viewport = useViewport();
  const isLargeDevice = viewport.width >= 1200;
  const [showOtherMatches, setShowOtherMatches] = useState(false);

  const currentPlayer = user.playerId ? players.find(p => p.id === user.playerId) : null;

  const today = moment().startOf('day');
  const nextWeek = moment().add(14, 'days').endOf('day');

  const userTeamIds = userTeams.map(team => team.id);

  // Get upcoming matches (next 2 weeks), exclude walk overs, forfeited opponents, and matches being played
  const upcomingMatches = matches
    .filter(match => {
      const matchDate = moment(match.date);
      if (!matchDate.isBetween(today, nextWeek, 'day', '[]')) return false;
      if (match.isSyncedWithFrenoy) return false;
      if (match.scoreType === 'WalkOver') return false;
      if (match.isBeingPlayed()) return false;
      const divisionRanking = match.getTeam().getDivisionRanking(match.opponent);
      if (!divisionRanking.empty && divisionRanking.isForfait) return false;
      return true;
    })
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  // Matches currently being played
  const matchesBeingPlayed = matches.filter(match => match.isBeingPlayed());

  // Check if user is in the formation of a match
  const isUserInFormation = (match: any): boolean => {
    if (!user.playerId) return false;
    const formation = match.getPlayerFormation(undefined);
    return formation.some((p: any) => p.id === user.playerId);
  };

  // User matches: user's team OR user is in formation
  const userMatches = upcomingMatches.filter(
    match => userTeamIds.includes(match.teamId) || isUserInFormation(match),
  );
  const otherMatches = upcomingMatches.filter(
    match => !userTeamIds.includes(match.teamId) && !isUserInFormation(match),
  );

  if (upcomingMatches.length === 0 && matchesBeingPlayed.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6}}>
        {currentPlayer && (
          <span style={{fontSize: '1.1em', fontWeight: 500, color: '#333', whiteSpace: 'nowrap'}}>
            {t('dashboard.greeting', {name: currentPlayer.firstName})}
          </span>
        )}
        <Strike text={t('dashboard.upcomingMatches')} style={{flex: 1, marginBottom: 0}} />
        {matchesBeingPlayed.length > 0 && (
          <Link to={t.route('matchesToday')}>
            <Button variant="success" size="sm" style={{whiteSpace: 'nowrap'}}>
              {t('dashboard.matchesBeingPlayed', {count: matchesBeingPlayed.length})}
            </Button>
          </Link>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isLargeDevice ? '1fr 1fr' : '1fr', gap: 8 }}>
        {userMatches.map(match => (
          <UpcomingMatchMiniView
            key={match.id}
            match={match}
          />
        ))}
      </div>

      {otherMatches.length > 0 && (
        <div style={{marginTop: 12}}>
          {!showOtherMatches && (
            <div style={{textAlign: 'center'}}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowOtherMatches(!showOtherMatches)}
              >
                {t('dashboard.showOtherMatches')}
              </Button>
            </div>
          )}

          {showOtherMatches && (
            <div style={{ display: 'grid', gridTemplateColumns: isLargeDevice ? '1fr 1fr' : '1fr', gap: 8, marginTop: 8 }}>
              {otherMatches.map(match => (
                <UpcomingMatchMiniView
                  key={match.id}
                  match={match}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
