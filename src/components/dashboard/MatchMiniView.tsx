import React from 'react';
import { Link } from 'react-router-dom';
import { IMatch } from '../../models/model-interfaces';
import { MatchScore } from '../matches/MatchScore';
import { CommentIcon } from '../controls/Icons/CommentIcon';
import t from '../../locales';

type MatchMiniViewProps = {
  match: IMatch;
  highlight?: boolean;
};

export const MatchMiniView = ({ match, highlight }: MatchMiniViewProps) => {
  const team = match.getTeam();
  const hasReport = !!match.description;
  const hasComments = match.comments && match.comments.length > 0;

  const renderPlayerResults = () => {
    if (!match.isSyncedWithFrenoy || match.games.length === 0) {
      return null;
    }

    const gameResults = match.getGameMatches();
    const playerSummary: {[playerId: number]: {name: string, won: string[], lost: string[]}} = {};

    gameResults.forEach(game => {
      const ownPlayer = game.ownPlayer as any;
      const {playerId} = ownPlayer;
      if (!playerId) return; // Skip doubles

      if (!playerSummary[playerId]) {
        playerSummary[playerId] = {
          name: ownPlayer.name || ownPlayer.alias || 'Unknown',
          won: [],
          lost: [],
        };
      }

      const opponentPlayer = game[!match.isHomeMatch ? 'home' : 'out'] as any;
      const opponentInfo = `${opponentPlayer.name || opponentPlayer.alias || 'Unknown'} (${opponentPlayer.ranking || '?'})`;

      if (game.outcome === 'Won') {
        playerSummary[playerId].won.push(opponentInfo);
      } else if (game.outcome === 'Lost') {
        playerSummary[playerId].lost.push(opponentInfo);
      }
    });

    return (
      <div style={{marginTop: 8, fontSize: '0.85em', color: '#555'}}>
        {Object.values(playerSummary).map((summary, idx) => (
          <div key={idx} style={{marginBottom: 4}}>
            <strong>{summary.name}:</strong>
            {summary.won.length > 0 && (
              <span style={{color: '#4CAF50', marginLeft: 5}}>
                Won vs {summary.won.join(', ')}
              </span>
            )}
            {summary.won.length > 0 && summary.lost.length > 0 && <span> | </span>}
            {summary.lost.length > 0 && (
              <span style={{color: '#f44336', marginLeft: 5}}>
                Lost vs {summary.lost.join(', ')}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 10,
        marginBottom: 8,
        backgroundColor: highlight ? '#F0F0F0' : '#fafafa',
        borderRadius: 4,
        border: highlight ? '2px solid #4CAF50' : '1px solid #ddd',
      }}
    >
      <Link to={t.route('match', {matchId: match.id})} style={{textDecoration: 'none', color: 'inherit'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <strong>{team.renderOwnTeamTitle()}</strong> vs <strong>{match.renderOpponentTitle()}</strong>
            <div style={{fontSize: '0.85em', color: '#666'}}>
              {match.getDisplayDate('d')} - {match.getDisplayTime()}
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            {hasReport && <span title="Wedstrijdverslag" style={{color: '#2196F3'}}>📝</span>}
            {hasComments && <CommentIcon />}
            <MatchScore match={match} />
          </div>
        </div>
        {renderPlayerResults()}
      </Link>
    </div>
  );
};
