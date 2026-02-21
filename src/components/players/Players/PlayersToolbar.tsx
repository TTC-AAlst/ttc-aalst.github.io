import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { downloadPlayersExcel } from '../../../utils/httpClient';
import {SortDirection, SortIconDropDown} from '../../controls/Icons/SortIconDropDown';
import {ExcelButton} from '../../controls/Buttons/ExcelButton';
import { t } from '../../../locales';

type PlayersToolbarProps = {
  marginLeft: number;
  onFilterChange: Function;
  canSort: boolean;
  activeSort: string;
  activeSortDirection: SortDirection;
  onSortChange: Function;
  onSortDirectionChange: (dir: SortDirection) => void;
  myPlayerPageUrl?: string;
};

export class PlayersToolbar extends Component<PlayersToolbarProps> {
  render() {
    const {marginLeft, onFilterChange} = this.props;

    const sortConfig = [
      {key: 'name', text: t('player.sort.name')},
      {key: 'Vttl', text: t('player.sort.vttl')},
      {key: 'Sporta', text: t('player.sort.sporta')},
    ];

    return (
      <div style={{marginRight: 5, marginLeft, marginBottom: 5}}>
        <TextField
          placeholder={t('players.search')}
          onChange={e => onFilterChange(e.target.value.toLowerCase())}
          style={{width: 150, marginTop: 8}}
        />

        <div className="button-bar-right" style={{marginTop: 5}}>
          {this.props.myPlayerPageUrl && (
            <OverlayTrigger placement="top" overlay={<Tooltip id="my-player-page">{t('nav.myPlayerPage')}</Tooltip>}>
              <Link to={this.props.myPlayerPageUrl} className="btn btn-outline-secondary">
                <i className="fa fa-user fa-2x" />
              </Link>
            </OverlayTrigger>
          )}

          {this.props.canSort ? (
            <SortIconDropDown
              config={sortConfig}
              activeSort={this.props.activeSort}
              activeSortDirection={this.props.activeSortDirection}
              onSortChange={newSort => this.props.onSortChange(newSort)}
              onSortDirectionChange={newDir => this.props.onSortDirectionChange(newDir)}
            />
          ) : null}

          <ExcelButton
            onClick={() => downloadPlayersExcel(t('players.downloadExcelFileName'))}
            tooltip={t('players.downloadExcel')}
            className="btn-outline-secondary"
          />
        </div>
      </div>
    );
  }
}
