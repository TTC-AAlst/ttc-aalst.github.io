import React, { Component } from 'react';
import { getPlayingStatusClass } from '../../models/PlayerModel';
import { PlayerLink } from './controls/PlayerLink';
import { CommentIcon } from '../controls/Icons/CommentIcon';
import { Icon } from '../controls/Icons/Icon';
import { Competition, IPlayer, MatchPlayerStatus, PickedPlayer } from '../../models/model-interfaces';

type PlayerCompetitionBadgeProps = {
  style?: React.CSSProperties;
  plyInfo: {
    matchPlayer: {status: MatchPlayerStatus};
    player: IPlayer;
  };
  competition: Competition;
}

export class PlayerCompetitionBadge extends Component<PlayerCompetitionBadgeProps> {
  static defaultProps = {
    style: {},
  };

  render() {
    const {plyInfo} = this.props;
    const comp = plyInfo.player.getCompetition(this.props.competition);
    return (
      <PlayerLink player={plyInfo.player} className="clickable">
        <span
          className={`clickable badge label-as-badge bg-${getPlayingStatusClass(plyInfo.matchPlayer.status) || 'primary'}`}
          key={plyInfo.player.id + plyInfo.matchPlayer.status}
          style={({fontSize: 14, display: 'inline-block', ...this.props.style})}
        >
          {plyInfo.player.alias}
          {this.props.competition && comp ? <span style={{marginLeft: 5, fontSize: 10}}>{comp.ranking}</span> : null}
        </span>
      </PlayerLink>
    );
  }
}

type PlayerCompetitionButtonProps = {
  plyInfo: PickedPlayer;
  onButtonClick: Function;
  isPicked: boolean;
  actionIconClass: string;
  style?: React.CSSProperties;
  competition: Competition;
}

export class PlayerCompetitionButton extends Component<PlayerCompetitionButtonProps> {
  render() {
    const {plyInfo} = this.props;
    const {matchPlayer} = plyInfo;
    const comp = plyInfo.player.getCompetition(this.props.competition);
    return (
      <button
        type="button"
        key={plyInfo.player.id + matchPlayer.status}
        className={`btn btn-xs btn-${getPlayingStatusClass(matchPlayer.status) || 'outline-primary'}`}
        title={matchPlayer.statusNote}
        style={({marginBottom: 5, ...this.props.style})}
        onClick={() => this.props.onButtonClick()}
      >
        {matchPlayer.statusNote ? <CommentIcon style={{marginRight: 5, marginLeft: 0}} /> : null}
        {plyInfo.player.alias}
        {this.props.competition && comp ? <span style={{marginLeft: 5, fontSize: 10}}>{comp.ranking}</span> : null}
        <Icon fa={this.props.actionIconClass} style={{marginRight: 0, marginLeft: 5, visibility: this.props.isPicked ? undefined : 'hidden'}} />
      </button>
    );
  }
}
