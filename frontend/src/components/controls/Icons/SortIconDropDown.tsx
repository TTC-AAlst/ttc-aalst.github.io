import React, {Component} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Icon} from './Icon';

export type SortDirection = 'asc' | 'desc';

const SortIcon = ({direction}: {direction: SortDirection}) => (  
  <Icon fa={`fa fa-2x fa-sort-alpha-${direction}`} translate tooltip="player.sort.tooltip" />
);

type SortIconDropDownProps = {
  config: {
    key: string,
    text: string,
  }[],
  activeSort?: string,
  activeSortDirection?: SortDirection,
  onSortChange: Function,
  onSortDirectionChange: (dir: SortDirection) => void,
}

export class SortIconDropDown extends Component<SortIconDropDownProps> {
  static defaultProps = {
    activeSortDirection: 'asc',
  };

  _onButtonSelect(configKey) {
    if (configKey === this.props.activeSort) {
      this.props.onSortDirectionChange(this.props.activeSortDirection === 'asc' ? 'desc' : 'asc');

    } else {
      this.props.onSortChange(configKey);
    }
  }

  render() {
    const {config} = this.props;
    return (
      <DropdownButton
        title={<SortIcon direction={this.props.activeSortDirection || 'asc'} />}
        id="sort-dropdown"
        onSelect={key => this._onButtonSelect(key)}
        style={{display: 'inline'}}
      >
        {config.map(button => (
          <Dropdown.Item eventKey={button.key} key={button.key}>
            <Icon
              fa={`fa fa-sort-${this.props.activeSortDirection}`}
              style={{visibility: this.props.activeSort !== button.key ? 'hidden' : undefined}}
            />

            <span style={{marginLeft: 12}}>{button.text}</span>
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }
}
