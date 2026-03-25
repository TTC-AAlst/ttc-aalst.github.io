import React, { Component } from 'react';
import { playerUtils } from '../../models/PlayerModel';
import { PlayerLink } from './controls/PlayerLink';
import { withTooltip } from '../../utils/decorators/withTooltip';
import { IStorePlayer } from '../../models/model-interfaces';

type PlayerAvatarProps = {
  player: IStorePlayer;
  style?: React.CSSProperties;
};

type PlayerAvatarState = {
  isLoaded: boolean;
  img: string;
};

class PlayerAvatar extends Component<PlayerAvatarProps, PlayerAvatarState> {
  constructor(props: PlayerAvatarProps) {
    super(props);

    const img = new Image();
    img.onload = () => this.setState({ isLoaded: true });
    img.src = playerUtils.getAvatarImageUrl(this.props.player.id, this.props.player.imageVersion);

    this.state = {
      isLoaded: false,
      img: img.src,
    };
  }

  render() {
    const { player, style, ...props } = this.props;
    const baseStyle: React.CSSProperties = {
      width: 40,
      height: 40,
      backgroundColor: '#bdbdbd',
      color: '#fff',
      fontSize: '1.25rem',
      ...style,
    };

    if (!this.state.isLoaded) {
      return (
        <PlayerLink player={player} className="">
          <div className="rounded-circle d-flex align-items-center justify-content-center" style={baseStyle} {...props}>
            {player.alias[0]}
          </div>
        </PlayerLink>
      );
    }

    return (
      <PlayerLink player={player} className="">
        <img
          className="rounded-circle"
          src={this.state.img}
          alt={player.alias}
          style={{ width: baseStyle.width, height: baseStyle.height, objectFit: 'cover', ...style }}
          {...props}
        />
      </PlayerLink>
    );
  }
}

export default withTooltip(PlayerAvatar);
