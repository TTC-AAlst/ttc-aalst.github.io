import React, {useState} from 'react';
import { IMatch, IStorePlayer } from '../../models/model-interfaces';
import { MatchScore } from '../matches/MatchScore';
import MatchVs from '../matches/Match/MatchVs';
import { CommentIcon } from '../controls/Icons/CommentIcon';
import { ThumbsUpIcon, ThumbsDownIcon } from '../controls/Icons/ThumbsIcons';
import { PlayerLink } from '../players/controls/PlayerLink';
import { selectPlayers, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';

type MatchMiniViewProps = {
  match: IMatch;
};

type OpponentNameProps = {
  name: string;
  ranking: string;
  showFull: boolean;
  onClick: (e: React.MouseEvent) => void;
};

const OpponentName = ({name, ranking, showFull, onClick}: OpponentNameProps) => {
  const firstName = name.split(' ')[0];
  const displayName = showFull ? name : firstName;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        textDecoration: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
      }}
    >
      {displayName}
      <span style={{opacity: 0.7}}> <small>({ranking})</small></span>
    </button>
  );
};

export const MatchMiniView = ({ match }: MatchMiniViewProps) => {
  const players = useTtcSelector(selectPlayers);
  const user = useTtcSelector(selectUser);
  const hasReport = !!match.description;
  const hasComments = match.comments && match.comments.length > 0;
  const [expandedPlayers, setExpandedPlayers] = useState<Set<number>>(new Set());

  // Check if current user played in this match
  const userPlayedInMatch = user.playerId && match.plays(user.playerId, 'onlyFinal');

  const getPlayer = (playerId: number): IStorePlayer | undefined => players.find(p => p.id === playerId);

  const togglePlayerExpanded = (playerId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedPlayers(prev => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
  };

  const renderPlayerResults = () => {
    if (!match.isSyncedWithFrenoy || match.games.length === 0) {
      return null;
    }

    const gameResults = match.getGameMatches();
    const playerSummary: {[playerId: number]: {
      playerId: number,
      name: string,
      won: {name: string, ranking: string}[],
      lost: {name: string, ranking: string}[]
    }} = {};

    gameResults.forEach(game => {
      const ownPlayer = game.ownPlayer as any;
      const {playerId} = ownPlayer;
      if (!playerId) return; // Skip doubles

      if (!playerSummary[playerId]) {
        playerSummary[playerId] = {
          playerId,
          name: ownPlayer.name || ownPlayer.alias || 'Unknown',
          won: [],
          lost: [],
        };
      }

      const opponentPlayer = game[!match.isHomeMatch ? 'home' : 'out'] as any;
      const opponentInfo = {
        name: opponentPlayer.name || opponentPlayer.alias || 'Unknown',
        ranking: opponentPlayer.ranking || '?',
      };

      if (game.outcome === 'Won') {
        playerSummary[playerId].won.push(opponentInfo);
      } else if (game.outcome === 'Lost') {
        playerSummary[playerId].lost.push(opponentInfo);
      }
    });

    const isExpanded = (playerId: number) => expandedPlayers.has(playerId);

    return (
      <div style={{marginTop: 8, fontSize: '0.85em', color: '#555'}}>
        {Object.values(playerSummary).map(summary => {
          const player = getPlayer(summary.playerId);
          return (
            <div key={summary.playerId} style={{marginBottom: 4}}>
              <strong>
                {player ? (
                  <PlayerLink player={player}>{summary.name}</PlayerLink>
                ) : (
                  summary.name
                )}
                :
              </strong>
              {summary.won.length > 0 && (
                <span style={{marginLeft: 5}}>
                  <ThumbsUpIcon color="#4CAF50" style={{marginRight: 3}} />
                  {summary.won.map((opponent, i) => (
                    <span key={i}>
                      {i > 0 && ', '}
                      <OpponentName
                        name={opponent.name}
                        ranking={opponent.ranking}
                        showFull={isExpanded(summary.playerId)}
                        onClick={e => togglePlayerExpanded(summary.playerId, e)}
                      />
                    </span>
                  ))}
                </span>
              )}
              {summary.lost.length > 0 && (
                <span style={{marginLeft: 8}}>
                  <ThumbsDownIcon color="#f44336" style={{marginRight: 3}} />
                  {summary.lost.map((opponent, i) => (
                    <span key={i}>
                      {i > 0 && ', '}
                      <OpponentName
                        name={opponent.name}
                        ranking={opponent.ranking}
                        showFull={isExpanded(summary.playerId)}
                        onClick={e => togglePlayerExpanded(summary.playerId, e)}
                      />
                    </span>
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 10,
        backgroundColor: userPlayedInMatch ? '#F0F0F0' : '#fafafa',
        borderRadius: 4,
        border: userPlayedInMatch ? '2px solid #4CAF50' : '1px solid #ddd',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <MatchVs match={match} withLinks withPosition ownTeamLink="main" />
          <div style={{fontSize: '0.85em', color: '#666'}}>
            {match.getDisplayDate('d')} - {match.getDisplayTime()}
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          {hasReport && <span title="Wedstrijdverslag" style={{color: '#2196F3'}}>📝</span>}
          {hasComments && <CommentIcon />}
          <MatchScore match={match} showComments style={{fontSize: 16}} />
        </div>
      </div>
      {renderPlayerResults()}
    </div>
  );
};
