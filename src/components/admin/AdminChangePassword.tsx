import React, {Component} from 'react';
import TextField from '@mui/material/TextField';
import { connect } from 'react-redux';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { adminSetNewPassword } from '../../reducers/userActions';

type AdminChangePasswordProps = {
  adminSetNewPassword: typeof adminSetNewPassword;
  onEnd: () => void;
}

type AdminChangePasswordState = {
  playerId: number | string;
  newPassword: string;
}

class AdminChangePassword extends Component<AdminChangePasswordProps, AdminChangePasswordState> {
  constructor(props) {
    super(props);
    this.state = {
      playerId: '',
      newPassword: '',
    };
  }

  render() {
    const paperStyle: React.CSSProperties = {
      marginLeft: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{t('password.changeTitle')}</h3>

        <PlayerAutoComplete
          selectPlayer={playerId => this.setState({playerId})}
          label={t('login.loginName')}
        />

        <br />

        <TextField
          label={t('password.newPassword')}
          type="password"
          onChange={e => this.setState({newPassword: e.target.value})}
        />

        <br />

        <MaterialButton
          variant="contained"
          label={t('profile.editPassword')}
          color="primary"
          style={{marginTop: 15}}
          onClick={() => {
            this.props.adminSetNewPassword(this.state);
            this.props.onEnd();
          }}
          disabled={!this.state.playerId && !this.state.newPassword}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  adminSetNewPassword: (data: Parameters<typeof adminSetNewPassword>[0]) => dispatch(adminSetNewPassword(data)),
});

export default connect(null, mapDispatchToProps)(AdminChangePassword);
