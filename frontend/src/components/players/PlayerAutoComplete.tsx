import React, { useState } from 'react';
import Select from 'react-select';
import { Competition } from '../../models/model-interfaces';
import { t } from '../../locales';
import { selectPlayers, useTtcSelector } from '../../utils/hooks/storeHooks';

type PlayerAutoCompleteProps = {
  competition?: Competition;
  label: string;
  style?: React.CSSProperties;
  selectPlayer: (playerId: number | 'system') => void;
}

export const PlayerAutoComplete = ({competition, label, style, selectPlayer, ...props}: PlayerAutoCompleteProps) => {
  const [searchText, setSearchText] = useState('');
  const players = useTtcSelector(selectPlayers);

  const onPlayerSelected = (option: any) => {
    if (!option.length) {
      setSearchText(option);
      if (option.value === 'system') {
        selectPlayer(option.value);
      } else {
        selectPlayer(parseInt(option.value, 10));
      }
    }
  };

  let filteredPlayers = players;
  if (competition) {
    filteredPlayers = players.filter(x => x[competition.toLowerCase()]);
  }
  const playerMenuItems = filteredPlayers.map(ply => ({
    value: ply.id.toString(),
    label: ply.name + (competition ? ` (${ply[competition.toLowerCase()].ranking})` : ''),
  }));
  const systemPlayerItem = {value: 'system', label: 'Systeem'};

  return (
    <div style={{...style, overflow: 'visible'}}>
      <Select
        value={searchText}
        placeholder={label}
        {...props}
        classNamePrefix="react-select-fix"
        onChange={onPlayerSelected}
        options={playerMenuItems.concat([systemPlayerItem]).sort((a, b) => a.label.localeCompare(b.label)) as any}
        isClearable={false}
        maxMenuHeight={200}
        noOptionsMessage={() => t('players.noFound')}
        openMenuOnFocus={false}
        openMenuOnClick={false}
      />
    </div>
  );
};
