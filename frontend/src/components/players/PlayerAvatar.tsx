import React, { useState, useEffect } from 'react';
import { playerUtils } from '../../models/PlayerModel';
import { PlayerLink } from './controls/PlayerLink';
import { withTooltip } from '../../utils/decorators/withTooltip';
import { IStorePlayer } from '../../models/model-interfaces';

type PlayerAvatarProps = {
  player: IStorePlayer;
  style?: React.CSSProperties;
};

const PlayerAvatar = React.forwardRef<HTMLElement, PlayerAvatarProps>(({ player, style, ...props }, ref) => {
  const imgSrc = playerUtils.getAvatarImageUrl(player.id, player.imageVersion);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = imgSrc;
  }, [imgSrc]);

  const baseStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    backgroundColor: '#bdbdbd',
    color: '#fff',
    fontSize: '1.25rem',
    ...style,
  };

  if (!isLoaded) {
    return (
      <PlayerLink player={player} className="">
        <div ref={ref as React.Ref<HTMLDivElement>} className="rounded-circle d-flex align-items-center justify-content-center" style={baseStyle} {...props}>
          {player.alias[0]}
        </div>
      </PlayerLink>
    );
  }

  return (
    <PlayerLink player={player} className="">
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        className="rounded-circle"
        src={imgSrc}
        alt={player.alias}
        style={{ width: baseStyle.width, height: baseStyle.height, objectFit: 'cover', ...style }}
        {...props}
      />
    </PlayerLink>
  );
});
PlayerAvatar.displayName = 'PlayerAvatar';

export default withTooltip(PlayerAvatar);
