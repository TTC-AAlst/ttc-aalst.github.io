import React from 'react';
import Select from 'react-select';
import { t } from '../../locales';

type PlayerStyleAutocompleteProps = {
  onChange: (val: string) => void;
  value?: string;
};

const PlayerStyleAutocomplete = ({ onChange, value }: PlayerStyleAutocompleteProps) => {
  const playingStyles = [t('player.styles.attacker'), t('player.styles.defender'), t('player.styles.allRounder')];

  return (
    <Select
      isSearchable
      onChange={option => option?.value && onChange(option.value)}
      value={{ value, label: value }}
      placeholder={t('player.editStyle.style')}
      options={playingStyles.map(style => ({ label: style, value: style }))}
      classNamePrefix="react-select-fix"
    />
  );
};

export default PlayerStyleAutocomplete;
