import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TabbedContainer } from '../controls/TabbedContainer';
import { PlayersCardGallery } from './PlayersCardGallery';
import { PlayersToolbar } from './Players/PlayersToolbar';
import { PlayersVttl } from './Players/PlayersVttl';
import { PlayersSporta } from './Players/PlayersSporta';
import { PlayersAllNotLoggedIn } from './Players/PlayersAllNotLoggedIn';
import { PlayersAllSmall } from './Players/PlayersAllSmall';
import { PlayersAllBig } from './Players/PlayersAllBig';
import { IPlayer, Competition } from '../../models/model-interfaces';
import { t } from '../../locales';
import { useViewport } from '../../utils/hooks/useViewport';
import { selectPlayers, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { SortDirection } from '../controls/Icons/SortIconDropDown';
import PlayerModel from '../../models/PlayerModel';

import './Players.css';

export const Players = () => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<Competition>('Vttl');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const viewport = useViewport();
  const user = useTtcSelector(selectUser);
  const allPlayers = useTtcSelector(selectPlayers);
  const currentPlayer = user.playerId ? allPlayers.find(p => p.id === user.playerId) : null;
  const playerUrl = currentPlayer ? t.route('player').replace(':playerId', encodeURI(new PlayerModel(currentPlayer).slug)) : '';

  let players = allPlayers.slice();
  if (filter) {
    players = players.filter(x => x.name.toLowerCase().includes(filter));
  }

  let filterFn: (plyA: IPlayer, plyB: IPlayer) => number;
  switch (sort) {
    case 'Vttl':
    case 'Sporta':
      filterFn = (plyA, plyB) => {
        const compA = plyA.getCompetition(sort);
        const compB = plyB.getCompetition(sort);
        if (!compA.ranking && !compB.ranking) {
          return 0;
        }
        if (!compA.ranking) {
          return 1;
        }
        if (!compB.ranking) {
          return -1;
        }
        return compA.position - compB.position;
      };
      break;
    default:
      filterFn = (plyA, plyB) => plyA.name.localeCompare(plyB.name);
  }

  players = players.sort(filterFn);
  if (sortDir === 'desc') {
    players = players.reverse();
  }

  const renderTabContent = (tabKey: string) => {
    let tabContent;
    switch (tabKey) {
      case 'list':
        tabContent = <AllPlayers players={players} />;
        break;
      case 'vttl':
        tabContent = <PlayersVttl filter={filter} />;
        break;
      case 'sporta':
        tabContent = <PlayersSporta filter={filter} />;
        break;
      case 'gallery':
      default:
        tabContent = <PlayersCardGallery players={players} />;
        break;
    }
    return (
      <div>
        {currentPlayer && (
          <div style={{marginLeft: 15, marginBottom: 5}}>
            <Link to={playerUrl} style={{fontWeight: 500, color: '#333', textDecoration: 'none'}}>
              {t('nav.myPlayerPage')}
              <i className="fa fa-arrow-right" style={{fontSize: '0.7em', marginLeft: 6, opacity: 0.5}} />
            </Link>
          </div>
        )}
        <PlayersToolbar
          marginLeft={15}
          onFilterChange={text => setFilter(text)}
          canSort={tabKey !== 'vttl' && tabKey !== 'sporta'}
          onSortChange={key => setSort(key)}
          onSortDirectionChange={key => setSortDir(key)}
          activeSort={sort}
          activeSortDirection={sortDir}
        />
        {tabContent}
      </div>
    );
  };

  const tabKeysConfig = [{
    key: 'gallery',
    title: t('players.gallery'),
  }, {
    key: 'vttl',
    title: 'Vttl',
  }, {
    key: 'sporta',
    title: 'Sporta',
  }, {
    key: 'list',
    title: t('players.list'),
  }];
  // console.log('config', tabKeysConfig);
  // let selectedTab = viewport.width < 450 ? 'list' : 'gallery';
  // console.log('tabKey', tabKey);
  // if (tabKey) {
  //   selectedTab = tabKeysConfig.find(x => x.title === tabKey)?.key ?? selectedTab;
  // }
  // console.log('selectedTab', selectedTab);

  return (
    <div style={{marginTop: 20, marginBottom: 10}}>
      <TabbedContainer
        selectedTab={viewport.width < 450 ? 'list' : 'gallery'}
        tabKeys={tabKeysConfig}
        tabRenderer={eventKey => renderTabContent(eventKey)}
        route={{base: t.route('players'), subs: 'playersTabs'}}
        forceTabs
      />
    </div>
  );
};

const AllPlayers = ({players}: {players: IPlayer[]}) => {
  const viewport = useViewport();
  const user = useTtcSelector(selectUser);

  if (!user.playerId) {
    return <PlayersAllNotLoggedIn players={players} />;
  }
  if (viewport.width < 700) {
    return <PlayersAllSmall players={players} />;
  }

  return <PlayersAllBig players={players} />;
};
