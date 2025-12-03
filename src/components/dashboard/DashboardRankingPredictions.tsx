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

  const rises = allPredictions.filter(p => p.isRise);
  const drops = allPredictions.filter(p => !p.isRise);

  // If no rises and no drops, don't show anything
  if (allPredictions.length === 0) {
    return null;
  }

  // If no rises at all, don't show anything
  if (rises.length === 0) {
    return null;
  }

  const renderPrediction = (pred: PredictionInfo) => (
    <span
      key={`${pred.player.id}-${pred.competition}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: pred.isRise ? '#e8f5e9' : '#ffebee',
        padding: '4px 10px',
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        fontSize: '0.9em',
      }}
    >
      <PlayerLink player={pred.player} alias style={{fontWeight: 'bold', marginRight: 6}} />
      <span style={{color: '#666', marginRight: 4}}>{pred.competition}:</span>
      <span style={{color: pred.isRise ? '#4CAF50' : '#f44336'}}>
        {pred.current} → {pred.predicted}
      </span>
    </span>
  );

  return (
    <div style={{marginBottom: 20}}>
      <Strike text="Oiljst AI" />
      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
        {rises.map(renderPrediction)}
      </div>

      {drops.length > 0 && (
        <div style={{marginTop: 8}}>
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
            <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: 8}}>
              {drops.map(renderPrediction)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
