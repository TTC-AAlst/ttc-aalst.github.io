import React, { useState } from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { Strike } from '../controls/controls/Strike';
import { MatchMiniView } from './MatchMiniView';
import { selectMatches, selectTeams, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { useViewport } from '../../utils/hooks/useViewport';
import { ITeam } from '../../models/model-interfaces';
import t from '../../locales';

export const DashboardRecentMatches = () => {
  const matches = useTtcSelector(selectMatches);
  const teams = useTtcSelector(selectTeams);
  const user = useTtcSelector(selectUser);
  const viewport = useViewport();
  const isLargeDevice = viewport.width >= 768;
  const [showOtherMatches, setShowOtherMatches] = useState(false);

  const today = moment();
  const lastWeek = moment().subtract(7, 'days');

  // Get default team IDs (VTTL A and Sporta A) if user has no teams
  const getDefaultTeamIds = () => {
    const vttlA = teams.find(team => team.competition === 'Vttl' && team.teamCode === 'A');
    const sportaA = teams.find(team => team.competition === 'Sporta' && team.teamCode === 'A');
    return ([vttlA, sportaA].filter(Boolean) as ITeam[]).map(team => team.id);
  };

  const userTeamIds = user.teams.length > 0 ? user.teams : getDefaultTeamIds();

  // Get matches from previous week and current week
  const recentMatches = matches
    .filter(match => {
      const matchDate = moment(match.date);
      return matchDate.isBetween(lastWeek, today, 'day', '[]');
    })
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  const userMatches = recentMatches.filter(match => userTeamIds.includes(match.teamId));
  const otherMatches = recentMatches.filter(match => !userTeamIds.includes(match.teamId));

  if (recentMatches.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.recentMatches')} style={{marginBottom: 6}} />
      <div style={{ display: 'grid', gridTemplateColumns: isLargeDevice ? '1fr 1fr' : '1fr', gap: 8 }}>
        {userMatches.map(match => (
          <MatchMiniView
            key={match.id}
            match={match}
            highlight
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
                <MatchMiniView
                  key={match.id}
                  match={match}
                  highlight={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
