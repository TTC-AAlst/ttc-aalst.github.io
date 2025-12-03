import React, { useState } from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { Strike } from '../controls/controls/Strike';
import { UpcomingMatchMiniView } from './UpcomingMatchMiniView';
import { selectMatches, selectTeams, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { useViewport } from '../../utils/hooks/useViewport';
import { ITeam } from '../../models/model-interfaces';
import t from '../../locales';

export const DashboardUpcomingMatches = () => {
  const matches = useTtcSelector(selectMatches);
  const teams = useTtcSelector(selectTeams);
  const user = useTtcSelector(selectUser);
  const viewport = useViewport();
  const isLargeDevice = viewport.width >= 1200;
  const [showOtherMatches, setShowOtherMatches] = useState(false);

  const today = moment().startOf('day');
  const nextWeek = moment().add(14, 'days').endOf('day');

  // Get default team IDs (VTTL A and Sporta A) if user has no teams
  const getDefaultTeamIds = () => {
    const vttlA = teams.find(team => team.competition === 'Vttl' && team.teamCode === 'A');
    const sportaA = teams.find(team => team.competition === 'Sporta' && team.teamCode === 'A');
    return ([vttlA, sportaA].filter(Boolean) as ITeam[]).map(team => team.id);
  };

  const userTeamIds = user.teams.length > 0 ? user.teams : getDefaultTeamIds();

  // Get upcoming matches (next 2 weeks)
  const upcomingMatches = matches
    .filter(match => {
      const matchDate = moment(match.date);
      return matchDate.isBetween(today, nextWeek, 'day', '[]') && !match.isSyncedWithFrenoy;
    })
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

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

  if (upcomingMatches.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.upcomingMatches')} style={{marginBottom: 6}} />
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
