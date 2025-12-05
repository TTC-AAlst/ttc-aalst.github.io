import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { IPlayer } from '../../../models/model-interfaces';
import { playerUtils } from '../../../models/PlayerModel';
import { PlayerLink } from '../../players/controls/PlayerLink';
import { Icon } from '../../controls/Icons/Icon';
import { PlayerPerformanceBadge } from '../../players/controls/PlayerPerformanceBadge';
import { GameResult, calculatePerformanceBadge } from '../../players/controls/PlayerPerformanceUtils';

export type PlayerCompetitionStats = {
  games: number;
  victories: number;
};

type PlayerPerformanceCardProps = {
  player: IPlayer;
  vttl: PlayerCompetitionStats | null;
  sporta: PlayerCompetitionStats | null;
  vttlResults?: GameResult[];
  sportaResults?: GameResult[];
  recentResults?: GameResult[];
  isCurrentUser?: boolean;
};

export const PlayerPerformanceCard = ({
  player,
  vttl,
  sporta,
  vttlResults = [],
  sportaResults = [],
  recentResults = [],
  isCurrentUser = false,
}: PlayerPerformanceCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = playerUtils.getImageUrl(player.id, player.imageVersion);
  const allResults = [...vttlResults, ...sportaResults];
  const badge = allResults.length >= 3 ? calculatePerformanceBadge(allResults, recentResults) : null;
  const isOnFire = badge?.type === 'on-fire';
  const isSolid = badge?.type === 'solid';

  // Gradient borders using the pseudo-element trick with wrapper padding
  const getBadgeGradient = () => {
    if (isOnFire) {
      return 'linear-gradient(135deg, #ff4500 0%, #ff6347 50%, #ff8c00 100%)';
    }
    if (isSolid) {
      return 'linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #daa520 100%)';
    }
    return null;
  };

  const getWrapperStyle = (): React.CSSProperties => {
    const badgeGradient = getBadgeGradient();

    if (badgeGradient) {
      return {
        background: badgeGradient,
        padding: 2,
        borderRadius: 10,
        display: 'flex',
      };
    }

    if (isCurrentUser) {
      return {
        background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 50%, #1976D2 100%)',
        padding: 2,
        borderRadius: 10,
        display: 'flex',
      };
    }

    return {};
  };

  const getCardStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      padding: 12,
      paddingTop: isOnFire ? 16 : 12,
      borderRadius: 8,
      textAlign: 'center',
      transition: 'transform 0.2s',
      overflow: 'hidden',
      backgroundColor: '#fafafa',
    };

    const hasBadgeGradient = isOnFire || isSolid;

    // Current user always gets the gradient background
    if (isCurrentUser) {
      return {
        ...baseStyle,
        flex: 1,
        width: '100%',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #dceefb 100%)',
      };
    }

    if (hasBadgeGradient) {
      return {
        ...baseStyle,
        flex: 1,
        width: '100%',
      };
    }

    return {
      ...baseStyle,
      border: '1px solid #ddd',
    };
  };

  const renderCompetitionStats = (
    label: string,
    stats: PlayerCompetitionStats | null,
    ranking: string | undefined,
  ) => {
    if (!stats) return null;
    const losses = stats.games - stats.victories;
    const winPercentage = stats.games > 0 ? Math.round((stats.victories / stats.games) * 100) : 0;

    return (
      <div style={{fontSize: '0.8em', color: '#666', marginTop: 4}}>
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
            width: 80,
            height: 80,
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
              width: 80,
              height: 80,
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
            width: 80,
            height: 80,
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

  const wrapperStyle = getWrapperStyle();
  const hasBadgeBorder = isOnFire || isSolid;
  const hasGradientBorder = hasBadgeBorder || isCurrentUser;

  // For current user with badge: show badge border outside, user border inside
  const needsDoubleWrapper = isCurrentUser && hasBadgeBorder;

  const cardContent = (
    <div style={getCardStyle()}>
      {isOnFire && <FireRibbon />}
      {renderAvatar()}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontSize: '0.9em',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
      }}
      >
        <PlayerLink player={player} alias />
        {badge && badge.type !== 'neutral' && (
          <span style={{
            display: 'inline-flex',
            border: `1px solid ${badge.color}`,
            borderRadius: 14,
          }}
          >
            <PlayerPerformanceBadge allResults={allResults} recentResults={recentResults} size="lg" showLabel={false} />
          </span>
        )}
      </div>
      {renderCompetitionStats('Vttl', vttl, player.vttl?.ranking)}
      {renderCompetitionStats('Sporta', sporta, player.sporta?.ranking)}
    </div>
  );

  if (needsDoubleWrapper) {
    // Current user with badge: badge border -> user border -> card with user background
    const userBorderStyle: React.CSSProperties = {
      background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 50%, #1976D2 100%)',
      padding: 2,
      borderRadius: 8,
      display: 'flex',
      flex: 1,
      width: '100%',
    };
    return (
      <div style={wrapperStyle}>
        <div style={userBorderStyle}>{cardContent}</div>
      </div>
    );
  }

  if (hasGradientBorder) {
    return <div style={wrapperStyle}>{cardContent}</div>;
  }

  return cardContent;
};

const FireRibbon = () => (
  <div
    style={{
      position: 'absolute',
      top: 10,
      left: -35,
      width: 110,
      padding: '3px 0',
      background: 'linear-gradient(90deg, #ff4500 0%, #ff6347 50%, #ff8c00 100%)',
      color: 'white',
      fontSize: '0.65em',
      fontWeight: 600,
      textAlign: 'center',
      transform: 'rotate(-45deg)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 1,
    }}
  >
    On Fire
  </div>
);
