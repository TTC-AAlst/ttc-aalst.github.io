import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { IPlayer } from '../../../models/model-interfaces';
import { playerUtils } from '../../../models/PlayerModel';
import { PlayerLink } from '../../players/controls/PlayerLink';
import { Icon } from '../../controls/Icons/Icon';
import t from '../../../locales';

export type PlayerCompetitionStats = {
  games: number;
  victories: number;
};

type PlayerPerformanceCardProps = {
  player: IPlayer;
  vttl: PlayerCompetitionStats | null;
  sporta: PlayerCompetitionStats | null;
};

export const PlayerPerformanceCard = ({ player, vttl, sporta }: PlayerPerformanceCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = playerUtils.getAvatarImageUrl(player.id, player.imageVersion);

  const renderCompetitionStats = (label: string, stats: PlayerCompetitionStats | null, ranking: string | undefined) => {
    if (!stats) return null;
    const losses = stats.games - stats.victories;
    const winPercentage = stats.games > 0 ? Math.round((stats.victories / stats.games) * 100) : 0;

    return (
      <div style={{fontSize: '0.8em', color: '#666', marginTop: 2}}>
        <strong style={{color: '#333'}}>{label}</strong>
        {ranking && <span style={{color: '#888'}}> ({ranking})</span>}
        <span style={{marginLeft: 6}}>
          <Icon fa="fa fa-thumbs-up" style={{color: '#4CAF50', marginRight: 2}} />
          {stats.victories}
          <Icon fa="fa fa-thumbs-down" style={{color: '#f44336', marginLeft: 6, marginRight: 2}} />
          {losses}
          <span style={{marginLeft: 4}}>({winPercentage}%)</span>
        </span>
      </div>
    );
  };

  const renderAvatar = () => {
    if (imageError || !player.imageVersion) {
      return (
        <Avatar
          style={{
            width: 60,
            height: 60,
            margin: '0 auto 8px',
            fontSize: '1.5em',
          }}
        >
          {player.alias?.[0] || player.firstName?.[0] || '?'}
        </Avatar>
      );
    }

    return (
      <>
        {!imageLoaded && (
          <Avatar
            style={{
              width: 60,
              height: 60,
              margin: '0 auto 8px',
              fontSize: '1.5em',
            }}
          >
            {player.alias?.[0] || player.firstName?.[0] || '?'}
          </Avatar>
        )}
        <img
          src={imageUrl}
          alt={player.alias}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 8,
            display: imageLoaded ? 'block' : 'none',
            margin: '0 auto 8px',
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </>
    );
  };

  return (
    <div
      style={{
        padding: 12,
        backgroundColor: '#fafafa',
        borderRadius: 4,
        border: '1px solid #ddd',
        textAlign: 'center',
        transition: 'transform 0.2s',
      }}
    >
      {renderAvatar()}
      <div style={{fontSize: '0.9em', fontWeight: 'bold', color: '#333'}}>
        <PlayerLink player={player} alias />
      </div>
      {renderCompetitionStats('Vttl', vttl, player.vttl?.ranking)}
      {renderCompetitionStats('Sporta', sporta, player.sporta?.ranking)}
    </div>
  );
};
