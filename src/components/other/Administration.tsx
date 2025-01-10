import React from 'react';
import Card from 'react-bootstrap/Card';
import { PlayerImage } from '../players/PlayerImage';
import { Email } from '../controls/controls/Email';
import { Telephone } from '../controls/controls/Telephone';
import { PlayerAddress } from '../players/controls/PlayerAddress';
import { t } from '../../locales';
import { OwnClubId } from '../../models/ClubModel';
import { selectPlayers, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { IClubManager } from '../../models/model-interfaces';

/**
 * manager.description is either:
 * - The string value of one of the constants as defined in AdminBoardMembers::clubManagerTypes
 * - A custom text
 * */
function getManagerDescription(manager: IClubManager) {
  if (manager.description === 'Default' || !manager.description) {
    return <br />;
  }

  const transKey = `clubs.managerTypes.${manager.description}`;
  const translation = t(transKey);
  if (transKey === translation) {
    return manager.description;
  }
  return translation;
}

export const Administration = () => {
  const club = useTtcSelector(state => state.clubs.find(c => c.id === OwnClubId));
  const user = useTtcSelector(selectUser);
  if (!club) {
    return <div />;
  }
  const {managers} = club;

  return (
    <div style={{marginTop: 10}}>
      <h1>{t('clubs.managementTitle')}</h1>
      <div className="row">
        {managers.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(manager => (
          <div className="col-lg-4 col-sm-6" key={manager.playerId} style={{paddingBottom: 10}}>
            <Card>
              <Card.Header>
                <span>
                  <strong>{manager.name}</strong>
                  <br />
                  {getManagerDescription(manager)}
                </span>
              </Card.Header>

              <Card.Body>
                <PlayerImage playerId={manager.playerId} center shape="circle" />
                {!!user.playerId && <PlayerDetails playerId={manager.playerId} />}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayerDetails = ({playerId}: {playerId: number}) => {
  const player = useTtcSelector(selectPlayers).find(x => x.id === playerId);
  if (!player) {
    return null;
  }

  return (
    <>
      <br />
      <Email email={player.contact.email} showIcon />
      <br />
      <Telephone number={player.contact.mobile} style={{marginTop: 5}} />

      <PlayerAddress contact={player.contact} style={{marginTop: 5}} />
    </>
  );
};
