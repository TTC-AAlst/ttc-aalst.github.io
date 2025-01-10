import React, {Component} from 'react';
import Avatar from '@mui/material/Avatar';
import {playerUtils} from '../../models/PlayerModel';
import {PlayerLink} from './controls/PlayerLink';
import { withTooltip } from '../../utils/decorators/withTooltip';
import { IStorePlayer } from '../../models/model-interfaces';

type PlayerAvatarProps = {
  player: IStorePlayer;
  style?: React.CSSProperties;
}

type PlayerAvatarState = {
  isLoaded: boolean;
  img: string;
}

class PlayerAvatar extends Component<PlayerAvatarProps, PlayerAvatarState> {
  constructor(props) {
    super(props);

    const img = new Image();
    img.onload = () => this.setState({isLoaded: true});
    img.src = playerUtils.getAvatarImageUrl(this.props.player.id, this.props.player.imageVersion);

    this.state = {
      isLoaded: false,
      img: img.src,
    };
  }

  render() {
    const {player, ...props} = this.props;
    if (!this.state.isLoaded) {
      return (
        <PlayerLink player={player} className="">
          <Avatar {...props}>{player.alias[0]}</Avatar>
        </PlayerLink>
      );
    }

    return (
      <PlayerLink player={player} className="">
        <Avatar {...props} src={this.state.img} />
      </PlayerLink>
    );
  }
}

export default withTooltip(PlayerAvatar);
