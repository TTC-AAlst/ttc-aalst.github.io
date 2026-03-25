import React from 'react';
import Table from 'react-bootstrap/Table';
import { TeamOverviewPlayerStats } from './TeamOverviewPlayerStats';
import { PlayerCompetitionLabel } from '../../players/PlayerCard';
import { ITeam } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';


export const TeamOverviewPlayers = ({team}: {team: ITeam}) => {
  const viewport = useViewport();
  const user = useTtcSelector(selectUser);

  const stats = team.getPlayerStats();
  if (stats.length === 0) {
    return null;
  }

  const showPlayerAlias = viewport.width < 500;
  const showMatchesPlayed = viewport.width > 400;
  return (
    <div>
      <h3>{t('teamCalendar.individual')}</h3>
      <Table size="sm" striped style={{maxWidth: 550}}>
        <thead>
          <tr>
            <th>{t('match.opponents.player')}</th>
            {showMatchesPlayed ? <th>{t('teamCalendar.matches')}</th> : null}
            <th>{t('match.playersVictoryTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {stats.sort((a, b) => b.games - a.games).map(stat => {
            if (stat.isDoubles) {
              return (
                <tr key="doubles">
                  <td colSpan={2}><strong>{t('match.doubles')}</strong></td>
                  <td><TeamOverviewPlayerStats stat={stat} /></td>
                </tr>
              );
            }
            return (
              <tr key={stat.ply.id} className={stat.ply.id === user.playerId ? 'match-won' : ''}>
                <td><PlayerCompetitionLabel comp={team.competition} player={stat.ply} withName={showPlayerAlias ? 'alias' : true} /></td>
                {showMatchesPlayed ? <td>{Math.floor(stat.games / team.getTeamPlayerCount())}</td> : null}
                <td><TeamOverviewPlayerStats stat={stat} /></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
