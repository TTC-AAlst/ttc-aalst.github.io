import React from 'react';
import { Link } from 'react-router-dom';
import { Strike } from '../controls/controls/Strike';
import { TeamRankingBadges } from '../teams/controls/TeamRankingBadges';
import { TeamPosition } from '../teams/controls/TeamPosition';
import { selectTeams, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { browseTo } from '../../routes';
import { ITeam } from '../../models/model-interfaces';
import t from '../../locales';

export const DashboardGlobalTeamStats = () => {
  const teams = useTtcSelector(selectTeams);
  const user = useTtcSelector(selectUser);

  const userTeams = teams.filter(team => user.teams.includes(team.id));
  const otherTeams = teams.filter(team => !user.teams.includes(team.id));

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
            <div>
              <strong>{team.renderOwnTeamTitle()}</strong>
              <div style={{fontSize: '0.9em', color: '#666'}}>{team.getDivisionDescription()}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <TeamPosition team={team} style={{marginRight: 5}} />
              <TeamRankingBadges team={team} />
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.globalTeamStats')} />

      {userTeams.length > 0 && (
        <div style={{marginBottom: 15}}>
          <h4 style={{fontSize: '1.1em', marginBottom: 10}}>{t('dashboard.yourTeams')}</h4>
          {userTeams.map(team => renderTeamStats(team, true))}
        </div>
      )}

      {otherTeams.length > 0 && userTeams.length > 0 && (
        <hr style={{margin: '20px 0', borderTop: '2px solid #ccc'}} />
      )}

      {otherTeams.length > 0 && (
        <div>
          {userTeams.length > 0 && (
            <h4 style={{fontSize: '1.1em', marginBottom: 10}}>{t('dashboard.otherTeams')}</h4>
          )}
          {otherTeams.map(team => renderTeamStats(team, false))}
        </div>
      )}
    </div>
  );
};
