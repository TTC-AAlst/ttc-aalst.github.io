import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Strike } from '../controls/controls/Strike';
import { PlayerLink } from '../players/controls/PlayerLink';
import { useTtcSelector } from '../../utils/hooks/storeHooks';
import { IPlayerCompetition, IStorePlayer } from '../../models/model-interfaces';
import rankingSorter from '../../models/utils/rankingSorter';
import t from '../../locales';

type PredictionInfo = {
  player: IStorePlayer;
  competition: 'Vttl' | 'Sporta';
  current: string;
  predicted: string;
  isRise: boolean;
};

const isRankingRise = (comp: IPlayerCompetition): boolean => {
  if (!comp.prediction) return false;
  // Lower index = better ranking, so if prediction < current, it's a rise
  return rankingSorter(comp.prediction, comp.ranking) < 0;
};

export const DashboardRankingPredictions = () => {
  const players = useTtcSelector(state => state.players);
  const [showDrops, setShowDrops] = useState(false);

  // Collect all predictions with rise/drop info
  const allPredictions: PredictionInfo[] = [];

  players.forEach(player => {
    if (player.vttl?.prediction) {
      allPredictions.push({
        player,
        competition: 'Vttl',
        current: player.vttl.ranking,
        predicted: player.vttl.prediction,
        isRise: isRankingRise(player.vttl),
      });
    }
    if (player.sporta?.prediction) {
      allPredictions.push({
        player,
        competition: 'Sporta',
        current: player.sporta.ranking,
        predicted: player.sporta.prediction,
        isRise: isRankingRise(player.sporta),
      });
    }
  });

  const vttlRises = allPredictions.filter(p => p.isRise && p.competition === 'Vttl');
  const sportaRises = allPredictions.filter(p => p.isRise && p.competition === 'Sporta');
  const vttlDrops = allPredictions.filter(p => !p.isRise && p.competition === 'Vttl');
  const sportaDrops = allPredictions.filter(p => !p.isRise && p.competition === 'Sporta');

  const hasRises = vttlRises.length > 0 || sportaRises.length > 0;
  const hasDrops = vttlDrops.length > 0 || sportaDrops.length > 0;

  // If no predictions at all, don't show anything
  if (allPredictions.length === 0) {
    return null;
  }

  // If no rises at all, don't show anything
  if (!hasRises) {
    return null;
  }

  const renderPrediction = (pred: PredictionInfo) => (
    <span
      key={`${pred.player.id}-${pred.competition}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: pred.isRise ? '#e8f5e9' : '#ffebee',
        padding: '2px 8px',
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
        fontSize: '0.85em',
      }}
    >
      <PlayerLink player={pred.player} alias style={{fontWeight: 500, marginRight: 4}} />
      <span style={{color: pred.isRise ? '#4CAF50' : '#f44336', fontWeight: 500}}>
        {pred.current}→{pred.predicted}
      </span>
    </span>
  );

  const renderSection = (label: string, predictions: PredictionInfo[]) => {
    if (predictions.length === 0) return null;
    return (
      <div style={{marginBottom: 6}}>
        <strong style={{fontSize: '0.85em', color: '#666', marginRight: 8}}>{label}:</strong>
        {predictions.map(renderPrediction)}
      </div>
    );
  };

  return (
    <div style={{marginBottom: 20}}>
      <Strike text="Oiljst AI" style={{marginBottom: 6}} />
      {renderSection('Vttl', vttlRises)}
      {renderSection('Sporta', sportaRises)}

      {hasDrops && (
        <div style={{marginTop: 6}}>
          {!showDrops && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowDrops(!showDrops)}
            >
              {t('dashboard.showPredictionDrops')}
            </Button>
          )}

          {showDrops && (
            <>
              {renderSection('Vttl', vttlDrops)}
              {renderSection('Sporta', sportaDrops)}
            </>
          )}
        </div>
      )}
    </div>
  );
};
