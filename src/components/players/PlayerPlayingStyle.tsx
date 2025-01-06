/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {Component} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { connect } from 'react-redux';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import {EditIcon} from '../controls/Icons/EditIcon';
import {PlayerAutoComplete} from './PlayerAutoComplete';
import PlayerStyleAutocomplete from './PlayerStyleAutocomplete';
import PlayerAvatar from './PlayerAvatar';
import { IPlayerStyle, IStorePlayer } from '../../models/model-interfaces';
import { RootState } from '../../store';
import UserModel from '../../models/UserModel';
import { t } from '../../locales';
import { updateStyle } from '../../reducers/playersReducer';


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
  user: UserModel;
  updateStyle: typeof updateStyle;
  iconStyle: 'avatar' | 'edit-icon';
  style?: React.CSSProperties,
}

type PlayerPlayingStyleFormState = {
  editingPlayer: null | IStorePlayer;
  newStyle: Omit<IPlayerStyle, 'playerId'>;
  editingBy: null | number | 'system';
}

class PlayerPlayingStyleFormComponent extends Component<PlayerPlayingStyleFormProps, PlayerPlayingStyleFormState> {
  constructor(props) {
    super(props);
    this.state = {
      editingPlayer: null,
      newStyle: {name: '', bestStroke: ''},
      editingBy: null,
    };
  }

  _openStyle(ply) {
    this.setState({editingPlayer: ply, newStyle: {...ply.style}, editingBy: this.props.user.playerId});
  }

  _closeStyle() {
    this.setState({editingPlayer: null, newStyle: {name: '', bestStroke: ''}});
  }

  _saveStyle() {
    this.props.updateStyle({
      player: this.state.editingPlayer!,
      newStyle: this.state.newStyle,
      updatedBy: this.state.editingBy!,
    });
    this._closeStyle();
  }

  _changeStyle(text: string) {
    this.setState(state => ({newStyle: {...state.newStyle, name: text}}));
  }

  _changeBestStroke(e) {
    this.setState(state => ({newStyle: {...state.newStyle, bestStroke: e.target.value}}));
  }

  _changePlayer(playerId: number | 'system') {
    this.setState({editingBy: playerId});
  }

  render() {
    const ply = this.props.player;

    const canChangeStyle = this.props.user.playerId && this.props.user.playerId !== ply.id;
    let openFormIcon;
    if (this.props.iconStyle === 'avatar') {
      openFormIcon = (
        <div
          className="clickable"
          onClick={canChangeStyle ? this._openStyle.bind(this, ply) : undefined}
          style={{display: 'inline-block'}}
          title={t('player.editStyle.tooltip', ply.alias)}
        >
          <PlayerAvatar player={ply} style={{backgroundColor: 'gold', margin: 0}} />
        </div>
      );

    } else {
      openFormIcon = (
        <EditIcon
          tooltip={t('player.editStyle.tooltip', ply.alias)}
          tooltipPlacement="left"
          style={this.props.style}
          onClick={this._openStyle.bind(this, ply)}
        />
      );
    }


    if (!this.state.editingPlayer) {
      return openFormIcon;
    }

    const changeStyleModalActions = [
      <MaterialButton
        key="1"
        label={t('common.cancel')}
        color="secondary"
        onClick={() => this._closeStyle()}
      />,
      <MaterialButton
        key="2"
        label={t('common.save')}
        color="primary"
        onClick={() => this._saveStyle()}
      />,
    ];

    return (
      <Dialog
        open={!!this.state.editingPlayer}
        onClose={() => this._closeStyle()}
        scroll="body"
        classes={{paperScrollPaper: 'overflow-visible', paperScrollBody: 'overflow-visible'}}
      >
        <DialogTitle style={{overflow: 'visible'}}>{t('player.editStyle.title', this.props.player.alias)}</DialogTitle>

        <DialogContent style={{overflow: 'visible'}}>
          <PlayerStyleAutocomplete
            t={t}
            value={this.state.newStyle.name || ''}
            onChange={text => this._changeStyle(text)}
          />

          <br />

          <TextField
            fullWidth
            label={t('player.editStyle.bestStroke')}
            type="text"
            value={this.state.newStyle.bestStroke || ''}
            onChange={e => this._changeBestStroke(e)}
          />

          <br />

          {this.props.user.isSystem() ? (
            <div style={{marginTop: 50}}>
              <PlayerAutoComplete
                selectPlayer={playerId => this._changePlayer(playerId)}
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
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  updateStyle: (data: Parameters<typeof updateStyle>[0]) => dispatch(updateStyle(data)),
});

export const PlayerPlayingStyleForm = connect(
  (state: RootState) => ({user: new UserModel(state.user)}),
  mapDispatchToProps,
)(PlayerPlayingStyleFormComponent);
