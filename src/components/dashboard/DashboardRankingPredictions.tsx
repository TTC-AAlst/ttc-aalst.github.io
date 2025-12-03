import React from 'react';
import Table from 'react-bootstrap/Table';
import { Strike } from '../controls/controls/Strike';
import { useTtcSelector } from '../../utils/hooks/storeHooks';
import t from '../../locales';

export const DashboardRankingPredictions = () => {
  const players = useTtcSelector(state => state.players);

  // Find players with prediction changes
  const playersWithPredictions = players
    .filter(player => {
      const vttlPrediction = player.vttl?.prediction;
      const sportaPrediction = player.sporta?.prediction;
      return vttlPrediction || sportaPrediction;
    })
    .map(player => ({
      name: player.alias || `${player.firstName} ${player.lastName}`,
      vttl: player.vttl,
      sporta: player.sporta,
    }));

  if (playersWithPredictions.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 20}}>
      <Strike text={t('dashboard.rankingPredictions')} />
      <Table size="sm" striped style={{backgroundColor: '#fafafa'}}>
        <thead>
          <tr>
            <th>{t('match.opponents.player')}</th>
            <th>Vttl</th>
            <th>Sporta</th>
          </tr>
        </thead>
        <tbody>
          {playersWithPredictions.map((player, idx) => (
            <tr key={idx}>
              <td><strong>{player.name}</strong></td>
              <td>
                {player.vttl?.prediction ? (
                  <span>
                    {player.vttl.ranking} → <strong style={{color: '#2196F3'}}>{player.vttl.prediction}</strong>
                  </span>
                ) : (
                  <span style={{color: '#999'}}>-</span>
                )}
              </td>
              <td>
                {player.sporta?.prediction ? (
                  <span>
                    {player.sporta.ranking} → <strong style={{color: '#2196F3'}}>{player.sporta.prediction}</strong>
                  </span>
                ) : (
                  <span style={{color: '#999'}}>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
