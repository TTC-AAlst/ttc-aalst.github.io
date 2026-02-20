import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { EditIcon } from '../controls/Icons/EditIcon';
import { PlayerAutoComplete } from './PlayerAutoComplete';
import PlayerStyleAutocomplete from './PlayerStyleAutocomplete';
import PlayerAvatar from './PlayerAvatar';
import { IPlayerStyle, IStorePlayer } from '../../models/model-interfaces';
import { t } from '../../locales';
import { updateStyle } from '../../reducers/playersReducer';
import { selectUser, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';


type PlayerPlayingStyleProps = {
  ply: IStorePlayer;
  allowEdit?: boolean;
}

export const PlayerPlayingStyle = ({ply, allowEdit = true}: PlayerPlayingStyleProps) => (
  <span>
    {allowEdit ? <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={{color: '#d3d3d3', float: 'right'}} /> : null}
    {ply.style.name}
    <br />
    <small>{ply.style.bestStroke}</small>
  </span>
);

type PlayerPlayingStyleFormProps = {
  player: IStorePlayer;
  iconStyle: 'avatar' | 'edit-icon';
  style?: React.CSSProperties,
}

export const PlayerPlayingStyleForm = ({player, ...props}: PlayerPlayingStyleFormProps) => {
  const user = useTtcSelector(selectUser);
  const dispatch = useTtcDispatch();
  const [editingPlayer, setEditingPlayer] = useState<null | IStorePlayer>(null);
  const [newStyle, setNewStyle] = useState<Omit<IPlayerStyle, 'playerId'>>({name: '', bestStroke: ''});
  const [editingBy, setEditingBy] = useState<null | number | 'system'>(null);

  const openStyle = () => {
    setEditingPlayer(player);
    setNewStyle({...player.style});
    setEditingBy(user.playerId);
  };

  const closeStyle = () => {
    setEditingPlayer(null);
    setNewStyle({name: '', bestStroke: ''});
  };

  const saveStyle = () => {
    dispatch(updateStyle({
      player: editingPlayer!,
      newStyle,
      updatedBy: editingBy!,
    }));
    closeStyle();
  };

  const canChangeStyle = user.playerId && user.playerId !== player.id;
  let openFormIcon: any = null;
  if (props.iconStyle === 'avatar') {
    // MatchCard (small):
    // Displays the Avatar but not to edit the style, instead goes to the player page
    openFormIcon = (
      <div
        className="clickable"
        onClick={canChangeStyle ? openStyle : undefined}
        style={{display: 'inline-block'}}
        title={canChangeStyle ? t('player.editStyle.tooltip', player.alias) : undefined}
      >
        <PlayerAvatar player={player} style={{backgroundColor: 'gold', margin: 0}} />
      </div>
    );

  } else if (canChangeStyle) {
    openFormIcon = (
      <EditIcon
        tooltip={t('player.editStyle.tooltip', player.alias)}
        tooltipPlacement="left"
        style={props.style}
        onClick={openStyle}
      />
    );
  }


  if (!editingPlayer) {
    return openFormIcon;
  }

  const changeStyleModalActions = [
    <MaterialButton
      key="1"
      label={t('common.cancel')}
      color="secondary"
      onClick={closeStyle}
    />,
    <MaterialButton
      key="2"
      label={t('common.save')}
      color="primary"
      onClick={saveStyle}
    />,
  ];

  return (
    <Dialog
      open={!!editingPlayer}
      onClose={closeStyle}
      scroll="body"
      classes={{paperScrollPaper: 'overflow-visible', paperScrollBody: 'overflow-visible'}}
    >
      <DialogTitle style={{overflow: 'visible'}}>{t('player.editStyle.title', player.alias)}</DialogTitle>

      <DialogContent style={{overflow: 'visible'}}>
        <PlayerStyleAutocomplete
          value={newStyle.name || ''}
          onChange={text => setNewStyle({...newStyle, name: text})}
        />

        <br />

        <TextField
          fullWidth
          label={t('player.editStyle.bestStroke')}
          type="text"
          value={newStyle.bestStroke || ''}
          onChange={e => setNewStyle({...newStyle, bestStroke: e.target.value})}
        />

        <br />

        {user.isSystem() ? (
          <div style={{marginTop: 50}}>
            <PlayerAutoComplete
              selectPlayer={playerId => setEditingBy(playerId)}
              label={t('system.playerSelect')}
            />
          </div>
        ) : null}
      </DialogContent>
      <DialogActions>
        {changeStyleModalActions}
      </DialogActions>
    </Dialog>
  );
};
