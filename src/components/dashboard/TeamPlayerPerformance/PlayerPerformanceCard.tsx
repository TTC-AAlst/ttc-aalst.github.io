import React from 'react';
import { Link } from 'react-router-dom';
import { ITeamPlayerStats } from '../../../models/model-interfaces';
import { selectMatches, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { getStaticFileUrl } from '../../../config';
import t from '../../../locales';

type PlayerPerformanceCardProps = {
  playerStat: ITeamPlayerStats;
};

export const PlayerPerformanceCard = ({ playerStat }: PlayerPerformanceCardProps) => {
  const allMatches = useTtcSelector(selectMatches);

  const { ply, victories, games } = playerStat;
  const winPercentage = games > 0 ? Math.round((victories / games) * 100) : 0;

  // Get last 3 matches for this player
  const playerMatches = allMatches
    .filter(match => match.isSyncedWithFrenoy && match.games.some(game => {
      const gameMatch = match.getGameMatches().find(g => g.matchNumber === game.matchNumber);
      return gameMatch?.ownPlayer.playerId === ply.id;
    }))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 3);

  const recentForm = playerMatches.map(match => {
    const playerGames = match.getGameMatches().filter(g => g.ownPlayer.playerId === ply.id);
    const won = playerGames.filter(g => g.outcome === 'Won').length;
    const total = playerGames.length;
    return { won, total, match };
  });

  const renderFormIndicator = () => {
    return (
      <div style={{display: 'flex', gap: 4, marginTop: 8}}>
        {recentForm.map((form, idx) => {
          const percentage = form.total > 0 ? (form.won / form.total) * 100 : 0;
          let color = '#f44336'; // Red for 0%
          if (percentage >= 75) color = '#4CAF50'; // Green for 75%+
          else if (percentage >= 50) color = '#FF9800'; // Orange for 50-74%
          else if (percentage > 0) color = '#FFC107'; // Yellow for 1-49%

          return (
            <div
              key={idx}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: color,
              }}
              title={`${form.won}/${form.total} won`}
            />
          );
        })}
      </div>
    );
  };

  const imageUrl = ply.imageVersion > 0
    ? `${getStaticFileUrl(`/img/players/${ply.id}.png?v=${ply.imageVersion}`)}`
    : '/img/players/placeholder.png';

  return (
    <Link to={t.route('player', {playerId: ply.id})} style={{textDecoration: 'none'}}>
      <div
        style={{
          padding: 12,
          backgroundColor: '#fafafa',
          borderRadius: 4,
          border: '1px solid #ddd',
          textAlign: 'center',
          transition: 'transform 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <img
          src={imageUrl}
          alt={ply.alias}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 8,
          }}
        />
        <div style={{fontSize: '0.9em', fontWeight: 'bold', color: '#333'}}>
          {ply.alias}
        </div>
        <div style={{fontSize: '0.85em', color: '#666', marginTop: 4}}>
          {victories}/{games} ({winPercentage}%)
        </div>
        {renderFormIndicator()}
      </div>
    </Link>
  );
};
