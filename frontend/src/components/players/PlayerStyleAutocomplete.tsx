import React, {Component} from 'react';
import Select from 'react-select';
import { t } from '../../locales';

type PlayerStyleAutocompleteProps = {
  onChange: (val: string) => void;
  value?: string;
}

export default class PlayerStyleAutocomplete extends Component<PlayerStyleAutocompleteProps> {
  _onChange(option) {
    this.props.onChange(option.value);
  }

  render() {
    const playingStyles = [
      t('player.styles.attacker'),
      t('player.styles.defender'),
      t('player.styles.allRounder'),
    ];

    return (
      <Select
        isSearchable
        onChange={option => this._onChange(option)}
        value={({value: this.props.value, label: this.props.value})}
        placeholder={t('player.editStyle.style')}
        options={playingStyles.map(style => ({label: style, value: style}))}
        classNamePrefix="react-select-fix"
      />
    );
  }
}
