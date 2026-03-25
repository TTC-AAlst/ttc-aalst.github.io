import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { PlayerAutoComplete } from '../players/PlayerAutoComplete';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { OwnClubId } from '../../models/ClubModel';
import { deleteBoardMember, saveBoardMember } from '../../reducers/playersReducer';

// ATTN: This corresponds to an enum in the backend: ClubManagerType
const ManagerTypeOther = 6;
const clubManagerTypes = [
  {key: 0, text: 'Default'},
  {key: 1, text: 'Chairman'},
  {key: 2, text: 'Secretary'},
  {key: 3, text: 'Treasurer'},
  {key: 4, text: 'Vttl'},
  {key: 5, text: 'Sporta'},
  {key: ManagerTypeOther, text: 'Other'},
];

export const AdminBoardMembers = () => {
  const [playerId, setPlayerId] = useState<number>(0);
  const [boardFunction, setBoardFunction] = useState(0);
  const [boardFunctionCustom, setBoardFunctionCustom] = useState('');
  const [sort, setSort] = useState(10);
  const club = useTtcSelector(state => state.clubs.find(c => c.id === OwnClubId));
  const dispatch = useTtcDispatch();

  const playerSelected = (plyId: number | 'system') => {
    if (plyId === 'system') {
      return;
    }

    setPlayerId(plyId);
    setBoardFunction(0);
    setBoardFunctionCustom('');
    setSort(0);
    if (club) {
      const manager = club.managers.find(x => x.playerId === plyId);
      if (manager) {
        const predefinedFn = clubManagerTypes.find(x => x.text === manager.description);
        setBoardFunction(predefinedFn ? predefinedFn.key : ManagerTypeOther);
        setBoardFunctionCustom(predefinedFn ? '' : manager.description);
        setSort(manager.sortOrder);
      }
    }
  };

  const paperStyle: React.CSSProperties = {
    marginLeft: 20,
    textAlign: 'center',
    display: 'inline-block',
  };
  return (
    <div style={paperStyle}>
      <h3>{t('clubs.managementTitle')}</h3>
      <PlayerAutoComplete
        selectPlayer={playerSelected}
        label={t('login.loginName')}
      />

      <br />
      <br />

      <DropdownButton
        title={t(`clubs.managerTypes.${(clubManagerTypes.find(x => x.key === boardFunction) || {text: 'Default'}).text}`)}
        id="boardFunction"
        size="lg"
        onSelect={fn => {
          const boardFn = parseInt(fn || '', 10);
          setBoardFunction(boardFn);
          if (boardFn !== ManagerTypeOther) {
            setBoardFunctionCustom('');
          }
        }}
      >
        {clubManagerTypes.map(button => (
          <Dropdown.Item eventKey={button.key} key={button.key}>
            {t(`clubs.managerTypes.${button.text}`)}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <div>
        <br />
        <TextField
          label="Specifieke functie omschrijving"
          onChange={e => {
            setBoardFunctionCustom(e.target.value);
            if (e.target.value) {
              setBoardFunction(ManagerTypeOther);
            }
          }}
          value={boardFunctionCustom}
        />
      </div>

      <br />
      <br />

      <TextField
        label={t('admin.board.sort')}
        type="number"
        onChange={e => setSort(parseInt(e.target.value, 10))}
        value={sort}
      />

      <br />

      <MaterialButton
        variant="contained"
        label={t('admin.board.save')}
        style={{marginTop: 15, marginRight: 8}}
        onClick={() => {
          const boardfn = boardFunctionCustom || clubManagerTypes[boardFunction].text;
          dispatch(saveBoardMember({playerId, boardFunction: boardfn, sort}));
        }}
        disabled={!playerId}
      />

      <MaterialButton
        variant="contained"
        label={t('admin.board.del')}
        style={{marginTop: 15}}
        onClick={() => dispatch(deleteBoardMember({playerId}))}
        disabled={!playerId}
      />
    </div>
  );
};
