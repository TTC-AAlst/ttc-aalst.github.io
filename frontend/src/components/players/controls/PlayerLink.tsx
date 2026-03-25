import React from 'react';
import { Link } from 'react-router-dom';
import t from '../../../locales';
import { IStorePlayer } from '../../../models/model-interfaces';
import PlayerModel from '../../../models/PlayerModel';

type PlayerLinkProps = {
  player: IStorePlayer;
  /** Allow to show alias */
  alias?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const PlayerLink = ({ player, alias, children, className = 'link-hover-underline', ...props }: PlayerLinkProps) => {
  const ply = new PlayerModel(player);
  const url = t.route('player').replace(':playerId', encodeURI(ply.slug));

  const content = children || (alias ? player.alias : `${player.firstName} ${player.lastName}`);

  return (
    <Link to={url} className={className} {...props}>
      {content}
    </Link>
  );
};
