import React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {PlayerAutoComplete} from '../../players/PlayerAutoComplete';
import {displayMobile, getPlayingStatusColor} from '../../../models/PlayerModel';
import {IMatch, IPlayer, ITeamPlayerInfo, TeamPlayerType} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useTtcDispatch } from '../../../utils/hooks/storeHooks';
import { selectPlayer } from '../../../reducers/matchesReducer';

type SelectPlayersFormProps = {
  match: IMatch;
}

export const SelectPlayersForm = ({match}: SelectPlayersFormProps) => {
  const dispatch = useTtcDispatch();
  const team = match.getTeam();
  let reservePlayers = team.getPlayers('reserve');

  // Add one time team players
  const selectedFromTeam = team.getPlayers().map(ply => ply.player.id);
  const otherSelectedPlayers = match.getOwnPlayerModels('onlyFinal')
    .filter(ply => selectedFromTeam.indexOf(ply.id) === -1)
    .map(ply => ({
      player: ply,
      type: 'Invaller' as TeamPlayerType,
    }));
  reservePlayers = reservePlayers.concat(otherSelectedPlayers);

  const onSelectPlayer = (playerId: number) => {
    dispatch(selectPlayer({matchId: match.id, status: match.block || 'Captain', statusNote: null, playerId}));
  };

  const teamCompetition = team.competition === 'Sporta' ? 'Sporta' : 'Vttl';
  return (
    <div>
      <PlayerAvatarList players={team.getPlayers('standard')} match={match} />
      {reservePlayers.length ? <Divider /> : null}
      {reservePlayers.length ? <PlayerAvatarList players={reservePlayers} match={match} /> : null}
      <Divider />
      <PlayerAutoComplete
        selectPlayer={ply => typeof ply === 'number' && onSelectPlayer(ply)}
        style={{marginTop: 15, marginLeft: 15, marginRight: 15}}
        label={t('match.chooseOtherPlayer')}
        competition={teamCompetition}
      />
    </div>
  );
};


type PlayerAvatarListProps = {
  match: IMatch;
  players: ITeamPlayerInfo[];
}


const PlayerAvatarList = ({players, match}: PlayerAvatarListProps) => (
  <List style={{paddingLeft: 14, paddingRight: 14}}>
    {players.map(({player/* , type */}) => (
      <SelectableMatchPlayerAvatar
        player={player}
        match={match}
        key={player.id}
      />
    ))}
  </List>
);



type SelectableMatchPlayerAvatarProps = {
  match: IMatch,
  player: IPlayer,
};

const SelectableMatchPlayerAvatar = ({match, player}: SelectableMatchPlayerAvatarProps) => {
  const dispatch = useTtcDispatch();
  const matchPlayer = match.plays(player, 'onlyFinal');
  const color = getPlayingStatusColor(matchPlayer);

  const onPlayerSelect = () => {
    dispatch(selectPlayer({matchId: match.id, status: match.block || 'Captain', statusNote: null, playerId: player.id}));
  };

  return (
    <ListItem component="button" onClick={onPlayerSelect} className="btn btn-outline-secondary" style={{marginBottom: 6}}>
      <ListItemIcon>
        <Avatar style={{backgroundColor: color || undefined, fontWeight: 'bold', color: 'white'}}>{player.alias[0]}</Avatar>
      </ListItemIcon>
      <ListItemText primary={player.alias} secondary={displayMobile(player.contact.mobile)} />
    </ListItem>
  );
};
