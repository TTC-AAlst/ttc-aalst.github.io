import React from 'react';
import { getPlayingStatusClass } from '../../models/PlayerModel';
import { PlayerLink } from './controls/PlayerLink';
import { CommentIcon } from '../controls/Icons/CommentIcon';
import { Icon } from '../controls/Icons/Icon';
import { Competition, IPlayer, MatchPlayerStatus, PickedPlayer } from '../../models/model-interfaces';

type PlayerCompetitionBadgeProps = {
  style?: React.CSSProperties;
  plyInfo: {
    matchPlayer: { status: MatchPlayerStatus };
    player: IPlayer;
  };
  competition: Competition;
};

export const PlayerCompetitionBadge = ({ plyInfo, competition, style = {} }: PlayerCompetitionBadgeProps) => {
  const comp = plyInfo.player.getCompetition(competition);
  return (
    <PlayerLink player={plyInfo.player} className="clickable">
      <span
        className={`clickable badge label-as-badge bg-${getPlayingStatusClass(plyInfo.matchPlayer.status) || 'primary'}`}
        key={plyInfo.player.id + plyInfo.matchPlayer.status}
        style={{ fontSize: 14, display: 'inline-block', ...style }}
      >
        {plyInfo.player.alias}
        {competition && comp ? <span style={{ marginLeft: 5, fontSize: 10 }}>{comp.ranking}</span> : null}
      </span>
    </PlayerLink>
  );
};

type PlayerCompetitionButtonProps = {
  plyInfo: PickedPlayer;
  onButtonClick: Function;
  isPicked: boolean;
  actionIconClass: string;
  style?: React.CSSProperties;
  competition: Competition;
};

export const PlayerCompetitionButton = ({ plyInfo, onButtonClick, isPicked, actionIconClass, style, competition }: PlayerCompetitionButtonProps) => {
  const { matchPlayer } = plyInfo;
  const comp = plyInfo.player.getCompetition(competition);
  return (
    <button
      type="button"
      key={plyInfo.player.id + matchPlayer.status}
      className={`btn btn-xs btn-${getPlayingStatusClass(matchPlayer.status) || 'outline-primary'}`}
      title={matchPlayer.statusNote}
      style={{ marginBottom: 5, ...style }}
      onClick={() => onButtonClick()}
    >
      {matchPlayer.statusNote ? <CommentIcon style={{ marginRight: 5, marginLeft: 0 }} /> : null}
      {plyInfo.player.alias}
      {competition && comp ? <span style={{ marginLeft: 5, fontSize: 10 }}>{comp.ranking}</span> : null}
      <Icon fa={actionIconClass} style={{ marginRight: 0, marginLeft: 5, visibility: isPicked ? undefined : 'hidden' }} />
    </button>
  );
};
