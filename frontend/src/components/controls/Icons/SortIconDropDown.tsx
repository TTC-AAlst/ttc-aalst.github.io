import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Icon } from './Icon';

export type SortDirection = 'asc' | 'desc';

const SortIcon = ({ direction }: { direction: SortDirection }) => <Icon fa={`fa fa-2x fa-sort-alpha-${direction}`} translate tooltip="player.sort.tooltip" />;

type SortIconDropDownProps = {
  config: {
    key: string;
    text: string;
  }[];
  activeSort?: string;
  activeSortDirection?: SortDirection;
  onSortChange: Function;
  onSortDirectionChange: (dir: SortDirection) => void;
};

export const SortIconDropDown = ({ config, activeSort, activeSortDirection = 'asc', onSortChange, onSortDirectionChange }: SortIconDropDownProps) => {
  const onButtonSelect = (configKey: string) => {
    if (configKey === activeSort) {
      onSortDirectionChange(activeSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(configKey);
    }
  };

  return (
    <DropdownButton
      title={<SortIcon direction={activeSortDirection} />}
      id="sort-dropdown"
      onSelect={key => key && onButtonSelect(key)}
      style={{ display: 'inline' }}
    >
      {config.map(button => (
        <Dropdown.Item eventKey={button.key} key={button.key}>
          <Icon fa={`fa fa-sort-${activeSortDirection}`} style={{ visibility: activeSort !== button.key ? 'hidden' : undefined }} />

          <span style={{ marginLeft: 12 }}>{button.text}</span>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
