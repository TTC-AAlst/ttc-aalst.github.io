import React from 'react';
import { IMatch, IMatchPlayer } from '../../../models/model-interfaces';
import { MobileLiveMatchHeader } from './MobileLiveMatchHeader';
import { MobileLiveMatchInProgress } from './MobileLiveMatchInProgress';
import { Icon } from '../../controls/Icons/Icon';
import { getRankingResults } from '../Match/OwnPlayer';
import { PlayerLink } from '../../players/controls/PlayerLink';
import { selectPlayers, useTtcSelector } from '../../../utils/hooks/storeHooks';

type MobileLiveMatchCardProps = {
  match: IMatch;
  expanded: boolean;
  onToggle: () => void;
  /** When false, the card is always expanded and not collapsible */
  isCollapsible: boolean;
};

const CollapsedPlayerSummary = ({ match }: { match: IMatch }) => {
  const allPlayers = useTtcSelector(selectPlayers);
  const hasPlayersOrGames = match.games.length > 0 || match.getTheirPlayers().length > 0;

  let players: IMatchPlayer[];
  if (hasPlayersOrGames) {
    players = match.getOwnPlayers().filter(ply => ply.status === match.block);
  } else {
    const formation = match.getPlayerFormation('onlyFinal');
    players = formation.map(f => f.matchPlayer);
  }

  if (players.length === 0) {
    return null;
  }

  const hasGames = match.games.length > 0;

  return (
    <div style={{ padding: '4px 8px', fontSize: '0.8em', color: '#666', textAlign: 'center' }}>
      {players.map((ply, i) => {
        const wins = hasGames ? getRankingResults(match, ply).win.length : 0;
        const storePlayer = ply.playerId ? allPlayers.find(p => p.id === ply.playerId) : null;
        return (
          <span key={ply.uniqueIndex || i}>
            {i > 0 && ' · '}
            {storePlayer ? (
              <PlayerLink player={storePlayer} alias style={{ color: 'inherit' }}/>
            ) : (
              ply.alias
            )}
            {' '}{ply.ranking}
            {hasGames && ` (${wins})`}
          </span>
        );
      })}
    </div>
  );
};

export const MobileLiveMatchCard = ({ match, expanded, onToggle, isCollapsible }: MobileLiveMatchCardProps) => {
  const showContent = !isCollapsible || expanded;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid #ddd',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative' }}>
        <MobileLiveMatchHeader match={match} />
        {isCollapsible && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              padding: 0,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              color: '#666',
            }}
          >
            <Icon fa={expanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
          </button>
        )}
      </div>
      {isCollapsible && !expanded && <CollapsedPlayerSummary match={match} />}
      {showContent && <MobileLiveMatchInProgress match={match} />}
    </div>
  );
};
