import React, { useEffect, useState } from 'react';
import { playerUtils } from '../../models/PlayerModel';
import { selectPlayers, useTtcSelector } from '../../utils/hooks/storeHooks';

type PlayerImageProps = {
  playerId: number;
  center?: boolean;
  shape?: 'rounded' | 'thumbnail' | 'circle';
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerImage = ({center, playerId, shape, ...props}: PlayerImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [img, setImg] = useState('');
  const player = useTtcSelector(selectPlayers).find(p => p.id === playerId);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setIsLoaded(true);
    image.src = playerUtils.getImageUrl(playerId, player?.imageVersion || 0);
    setImg(image.src);
  }, [playerId, player]);

  const align = (center ?? true) ? 'center' : undefined;
  if (!isLoaded) {
    return (
      <div style={{textAlign: align, marginTop: 10, opacity: 0.4, height: 189}} {...props}>
        <span className="fa-stack fa-5x">
          <i className="fa fa-camera fa-stack-1x" />
          <i className="fa fa-ban fa-stack-2x text-danger" />
        </span>
      </div>
    );
  }

  return (
    <div style={{textAlign: align}} {...props}>
      <img src={img} className={`img-${shape ?? 'rounded'}`} style={{height: 200}} alt="Speler" />
    </div>
  );
};
