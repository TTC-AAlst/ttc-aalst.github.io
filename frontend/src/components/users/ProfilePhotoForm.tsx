import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ImageEditor from '../controls/image/ImageEditor';
import { playerUtils } from '../../models/PlayerModel';
import ImageDropzone from '../controls/image/ImageDropzone';
import { PlayerAutoComplete } from '../players/PlayerAutoComplete';
import { PlayerImage } from '../players/PlayerImage';
import PlayerAvatar from '../players/PlayerAvatar';
import { t } from '../../locales';
import storeUtil from '../../storeUtil';
import { uploadPlayer } from '../../reducers/userActions';
import { selectUser, useTtcSelector, useTtcDispatch } from '../../utils/hooks/storeHooks';
import { getStaticFileUrl } from '../../config';

export const ProfilePhotoAvatarForm = () => {
  const user = useTtcSelector(selectUser);
  return <ProfilePhotoForm user={user} size={playerUtils.getPlayerAvatarImageSize()} type="player-avatar" borderRadius={19} />;
};

type ProfilePhotoFormProps = {
  size?: { width: number; height: number };
  type?: 'player-photo' | 'player-avatar';
  user: ReturnType<typeof selectUser>;
  borderRadius?: number;
};

const ProfilePhotoForm = ({ size = playerUtils.getPlayerImageSize(), type = 'player-photo', user, borderRadius = 0 }: ProfilePhotoFormProps) => {
  const dispatch = useTtcDispatch();
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');
  const [playerId, setPlayerId] = useState(0);

  const saveImage = () => {
    dispatch(
      uploadPlayer({
        imageBase64: preview,
        playerId: playerId || user.playerId,
        type,
      }),
    );
    setFileName('');
    setPreview('');
  };

  return (
    <>
      <div style={{ marginBottom: 10, padding: 10 }} className="row">
        <div className="col-xs-10 col-sm-8 col-lg-6">
          <h3>
            {t('photos.uploadNewTitle')}
            <small>
              {' '}
              ({size.width}px x {size.height}px)
            </small>
          </h3>

          {user.isAdmin() ? <PlayerAutoComplete selectPlayer={id => setPlayerId(id === 'system' ? -1 : id)} label={t('system.playerSelect')} /> : null}

          <div style={{ marginTop: 16 }}>
            <ImageDropzone fileUploaded={(name: string) => setFileName(name)} />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 10, padding: 10 }} className="row">
        <div className="col-xs-10 col-md-8 col-lg-6">
          {fileName ? (
            <div style={{ marginTop: 20 }}>
              <h3>{t('photos.adjustTitle')}</h3>
              <ImageEditor size={size} image={getStaticFileUrl(fileName)} borderRadius={borderRadius} updateImage={p => setPreview(p.toDataURL())} />
            </div>
          ) : null}
        </div>
        {preview ? (
          <div className="col-xs-10 col-md-8 col-lg-6">
            <div className="thumbnail" style={{ width: 250, marginTop: 10 }}>
              <img src={preview} style={{ marginTop: 7, borderRadius: 19 }} width={size.width} height={size.height} alt="Preview" />

              <div className="caption" style={{ textAlign: 'center', marginTop: 40 }}>
                <Button variant="primary" style={{ marginTop: -40 }} onClick={saveImage}>
                  {t('photos.save')}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        <div style={{ marginBottom: 10, padding: 10 }} className="row">
          <div className="col-xs-10 col-md-8 col-lg-6">
            <h3>{t('photos.existingTitle')}</h3>
            {type === 'player-photo' ? <PlayerImage playerId={playerId || user.playerId} /> : <PlayerAvatar player={storeUtil.getPlayer(user.playerId)} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePhotoForm;
