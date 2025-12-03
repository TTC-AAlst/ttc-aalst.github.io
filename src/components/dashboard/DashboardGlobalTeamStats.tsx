import React from 'react';
import { Link } from 'react-router-dom';
import { Strike } from '../controls/controls/Strike';
import { TeamRankingBadges } from '../teams/controls/TeamRankingBadges';
import { TeamPosition } from '../teams/controls/TeamPosition';
import { selectTeams, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { useViewport } from '../../utils/hooks/useViewport';
import { browseTo } from '../../routes';
import { ITeam } from '../../models/model-interfaces';
import t from '../../locales';

export const DashboardGlobalTeamStats = () => {
  const teams = useTtcSelector(selectTeams);
  const user = useTtcSelector(selectUser);
  const viewport = useViewport();
  const isLargeDevice = viewport.width >= 768;

  const userTeams = teams.filter(team => user.teams.includes(team.id));
  const otherTeams = teams.filter(team => !user.teams.includes(team.id));
  const allTeams = [...userTeams, ...otherTeams];

  const renderTeamStats = (team: ITeam, isUserTeam: boolean) => {
    const ranking = team.getDivisionRanking();
    if (ranking.empty) {
      return null;
    }

    return (
      <div
        key={team.id}
        style={{
          padding: 10,
          marginBottom: 8,
          backgroundColor: isUserTeam ? '#F0F0F0' : '#fafafa',
          borderRadius: 4,
          border: isUserTeam ? '2px solid #4CAF50' : '1px solid #ddd',
        }}
      >
        <Link to={browseTo.getTeam(team)} style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <TeamPosition team={team} />
              <div>
                <strong>{team.renderOwnTeamTitle()}</strong>
                <div style={{fontSize: '0.9em', color: '#666'}}>{team.getDivisionDescription()}</div>
              </div>
            </div>
            <TeamRankingBadges team={team} />
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.globalTeamStats')} style={{marginBottom: 6}} />

      <div style={{ display: 'grid', gridTemplateColumns: isLargeDevice ? '1fr 1fr' : '1fr', gap: 8 }}>
        {allTeams.map(team => renderTeamStats(team, user.teams.includes(team.id)))}
      </div>
    </div>
  );
};
