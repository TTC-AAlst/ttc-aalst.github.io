import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Competition } from '../../models/model-interfaces';
import { t } from '../../locales';
import { selectPlayers, useTtcSelector } from '../../utils/hooks/storeHooks';

type OptionType = { value: string; label: string };

type PlayerAutoCompleteProps = {
  competition?: Competition;
  label: string;
  style?: React.CSSProperties;
  selectPlayer: (playerId: number | 'system') => void;
};

export const PlayerAutoComplete = ({ competition, label, style, selectPlayer, ...props }: PlayerAutoCompleteProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const players = useTtcSelector(selectPlayers);

  const onPlayerSelected = (option: SingleValue<OptionType>) => {
    if (option) {
      setSelectedOption(option);
      if (option.value === 'system') {
        selectPlayer('system');
      } else {
        selectPlayer(parseInt(option.value, 10));
      }
    }
  };

  let filteredPlayers = players;
  const compKey = competition?.toLowerCase() as 'vttl' | 'sporta' | undefined;
  if (compKey) {
    filteredPlayers = players.filter(x => x[compKey]);
  }
  const playerMenuItems = filteredPlayers.map(ply => ({
    value: ply.id.toString(),
    label: ply.name + (compKey ? ` (${ply[compKey]?.ranking})` : ''),
  }));
  const systemPlayerItem = { value: 'system', label: 'Systeem' };

  return (
    <div style={{ ...style, overflow: 'visible' }}>
      <Select<OptionType>
        value={selectedOption}
        placeholder={label}
        {...props}
        classNamePrefix="react-select-fix"
        onChange={onPlayerSelected}
        options={playerMenuItems.concat([systemPlayerItem]).sort((a, b) => a.label.localeCompare(b.label))}
        isClearable={false}
        maxMenuHeight={200}
        noOptionsMessage={() => t('players.noFound')}
        openMenuOnFocus={false}
        openMenuOnClick={false}
      />
    </div>
  );
};
