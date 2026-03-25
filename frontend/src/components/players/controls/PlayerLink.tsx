import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import t from '../../../locales';
import {IStorePlayer} from '../../../models/model-interfaces';
import PlayerModel from '../../../models/PlayerModel';

type PlayerLinkProps = {
  player: IStorePlayer;
  /** Allow to show alias */
  alias?: boolean;
  children?: any;
  className?: string;
  style?: React.CSSProperties;
}

export class PlayerLink extends Component<PlayerLinkProps> {
  static defaultProps = {
    className: 'link-hover-underline',
  };

  render() {
    const {player, alias, children, className, ...props} = this.props;
    const ply = new PlayerModel(player);

    const url = t.route('player').replace(':playerId', encodeURI(ply.slug));
    return (
      <Link to={url} className={className} {...props}>
        {this.getContent()}
      </Link>
    );
  }

  getContent() {
    const {player, alias, children} = this.props;
    if (children) {
      return children;
    }
    return alias ? player.alias : `${player.firstName} ${player.lastName}`;
  }
}
