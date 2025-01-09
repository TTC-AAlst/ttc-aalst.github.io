import React, {Component} from 'react';
import { connect } from 'react-redux';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import ImageEditor from '../controls/image/ImageEditor';
import {playerUtils} from '../../models/PlayerModel';
import ImageDropzone from '../controls/image/ImageDropzone';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import PlayerImage from '../players/PlayerImage';
import PlayerAvatar from '../players/PlayerAvatar';
import {IUser} from '../../models/UserModel';
import { t } from '../../locales';
import storeUtil from '../../storeUtil';
import { uploadPlayer } from '../../reducers/userReducer';
import { selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { getStaticFileUrl } from '../../config';


export const ProfilePhotoAvatarForm = () => {
  const user = useTtcSelector(selectUser);
  return (
    <ProfilePhotoFormComponent
      user={user}
      size={playerUtils.getPlayerAvatarImageSize()}
      type="player-avatar"
      borderRadius={19}
    />
  );
};



type ProfilePhotoFormProps = {
  size?: {width: number, height: number},
  type?: 'player-photo' | 'player-avatar',
  user: IUser;
  uploadPlayer: typeof uploadPlayer,
  borderRadius?: number;
}

type ProfilePhotoFormState = {
  fileName: string;
  preview: string;
  playerId: number;
}


class ProfilePhotoForm extends Component<ProfilePhotoFormProps, ProfilePhotoFormState> {
  static defaultProps = {
    size: playerUtils.getPlayerImageSize(),
    type: 'player-photo' as const,
    borderRadius: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      preview: '',
      playerId: 0,
    };
  }

  _saveImage() {
    this.props.uploadPlayer({
      imageBase64: this.state.preview,
      playerId: this.state.playerId || this.props.user.playerId,
      type: this.props.type || '',
    });
    this.setState({fileName: '', preview: ''});
  }

  render() {
    const tmpFileName = this.state.fileName;
    return (
      <div style={{marginBottom: 10, padding: 10}} className="row">
        <div className="col-xs-10 col-sm-8 col-lg-6">
          <h3>
            {t('photos.uploadNewTitle')}
            <small> ({this.props.size!.width}px x {this.props.size!.height}px)</small>
          </h3>

          {this.props.user.isAdmin() ? (
            <PlayerAutoComplete
              selectPlayer={playerId => this.setState({playerId: playerId === 'system' ? -1 : playerId})}
              label={t('system.playerSelect')}
            />
          ) : null}

          <div style={{marginTop: 16}}>
            <ImageDropzone fileUploaded={fileName => this.setState({fileName})} />
          </div>
          {this.state.fileName ? (
            <div style={{marginTop: 20}}>
              <h3>{t('photos.adjustTitle')}</h3>
              <ImageEditor
                size={this.props.size!}
                image={getStaticFileUrl(tmpFileName)}
                borderRadius={this.props.borderRadius!}
                updateImage={(preview, croppingRect) => this.setState({preview: preview.toDataURL()})}
              />
            </div>
          ) : null}
        </div>
        {this.state.preview ? (
          <div className="col-sm-6">
            <div className="thumbnail" style={{width: 250, marginTop: 10}}>
              <img
                src={this.state.preview}
                style={{marginTop: 7, borderRadius: 19}}
                width={this.props.size!.width}
                height={this.props.size!.height}
                alt="Preview"
              />

              <div className="caption" style={{textAlign: 'center', marginTop: 40}}>
                <MaterialButton
                  label={t('photos.save')}
                  color="primary"
                  style={{marginTop: -40}}
                  onClick={() => this._saveImage()}
                />
              </div>
            </div>
          </div>
        ) : null}
        {!this.props.user.isAdmin() ? (
          <div className="col-sm-6">
            <h3>{t('photos.existingTitle')}</h3>
            {this.props.type === 'player-photo' ? (
              <PlayerImage playerId={this.state.playerId || this.props.user.playerId} />
            ) : (
              <PlayerAvatar player={storeUtil.getPlayer(this.props.user.playerId)} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  uploadPlayer: (data: Parameters<typeof uploadPlayer>[0]) => dispatch(uploadPlayer(data)),
});

const ProfilePhotoFormComponent = connect(null, mapDispatchToProps)(ProfilePhotoForm);
export default ProfilePhotoFormComponent;
