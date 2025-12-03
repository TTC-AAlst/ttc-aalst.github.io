import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IPlayerEvent, IStorePlayer, PlayerEventType } from '../../../models/model-interfaces';
import { TimeAgo } from '../../controls/controls/TimeAgo';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';
import PlayerModel from '../../../models/PlayerModel';
import storeUtil from '../../../storeUtil';
import t from '../../../locales';

type PlayerEventItemProps = {
  event: IPlayerEvent;
};

type PlayerStyleData = {
  PlayerId: number;
  Style: string;
  BestStroke: string | null;
};

type MatchCommentData = {
  CommentId: number;
};

const getEventIcon = (eventType: PlayerEventType): string => {
  switch (eventType) {
    case 'PlayerStyleUpdated':
      return '🎨';
    case 'MatchReport':
      return '📝';
    case 'MatchComment':
      return '💬';
    default:
      return '📌';
  }
};

const MAX_CONTENT_LENGTH = 150;

const truncateHtml = (html: string, maxLength: number): { html: string; isTruncated: boolean } => {
  // Strip HTML tags to get plain text for length calculation
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  if (plainText.length <= maxLength) {
    return { html, isTruncated: false };
  }

  // Truncate the plain text and add ellipsis
  const truncated = `${plainText.substring(0, maxLength).trim()}...`;
  return { html: truncated, isTruncated: true };
};

const getPlayerUrl = (player: IStorePlayer): string => {
  const ply = new PlayerModel(player);
  return t.route('player').replace(':playerId', encodeURI(ply.slug));
};

export const PlayerEventItem = ({ event }: PlayerEventItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const players = useTtcSelector(state => state.players);
  const matches = useTtcSelector(state => state.matches);
  const readonlyMatches = useTtcSelector(state => state.readonlyMatches);

  const allMatches = [...matches, ...readonlyMatches];
  const match = event.matchId ? allMatches.find(m => m.id === event.matchId) : null;

  const getTitle = (): React.ReactNode => {
    switch (event.type) {
      case 'PlayerStyleUpdated': {
        if (!event.data) return 'Speelstijl aangepast';
        try {
          const data: PlayerStyleData = JSON.parse(event.data);
          const targetPlayer = players.find(p => p.id === data.PlayerId);
          if (targetPlayer) {
            return (
              <>
                {'Speelstijl van '}
                <Link to={getPlayerUrl(targetPlayer)} style={{ color: '#2196F3' }}>
                  {targetPlayer.alias || targetPlayer.firstName}
                </Link>
                {' aangepast'}
              </>
            );
          }
          return 'Speelstijl aangepast';
        } catch {
          return 'Speelstijl aangepast';
        }
      }
      case 'MatchReport':
        return 'Wedstrijdverslag toegevoegd';
      case 'MatchComment':
        return 'Reactie toegevoegd';
      default:
        return 'Activiteit';
    }
  };

  const getContent = (): { html: string; isTruncated: boolean } | null => {
    switch (event.type) {
      case 'PlayerStyleUpdated': {
        if (!event.data) return null;
        try {
          const data: PlayerStyleData = JSON.parse(event.data);
          const parts: string[] = [];
          if (data.Style) {
            parts.push(`stijl: ${data.Style}`);
          }
          if (data.BestStroke) {
            parts.push(`beste slag: ${data.BestStroke}`);
          }
          if (parts.length === 0) return null;
          return { html: parts.join(', '), isTruncated: false };
        } catch {
          return null;
        }
      }
      case 'MatchReport': {
        if (match?.description) {
          if (expanded) {
            return { html: match.description, isTruncated: true };
          }
          return truncateHtml(match.description, MAX_CONTENT_LENGTH);
        }
        return null;
      }
      case 'MatchComment': {
        if (!event.data || !match) return null;
        try {
          const data: MatchCommentData = JSON.parse(event.data);
          const comment = match.comments?.find(c => c.id === data.CommentId);
          if (comment?.text) {
            if (expanded) {
              return { html: comment.text, isTruncated: true };
            }
            return truncateHtml(comment.text, MAX_CONTENT_LENGTH);
          }
          if (comment?.imageUrl) {
            return { html: '📷 Foto toegevoegd', isTruncated: false };
          }
        } catch {
          return null;
        }
        return null;
      }
      default:
        return null;
    }
  };

  const getMatchInfo = (): React.ReactNode => {
    if (!match || !event.matchId) return null;
    const matchUrl = `${t.route('match').replace(':matchId', String(event.matchId))}/wedstrijdverslag`;

    // Try to get match model with methods for proper title rendering
    try {
      const matchModel = storeUtil.getMatch(event.matchId);
      if (matchModel) {
        const team = matchModel.getTeam();
        const opponentTitle = matchModel.renderOpponentTitle();
        const teamTitle = team?.renderOwnTeamTitle?.() || '';
        const matchTitle = matchModel.isHomeMatch
          ? `${teamTitle} - ${opponentTitle}`
          : `${opponentTitle} - ${teamTitle}`;
        return (
          <Link to={matchUrl} style={{ color: '#2196F3', fontSize: '0.85em' }}>
            {matchTitle}
          </Link>
        );
      }
    } catch {
      // Fall back to simple display
    }

    return (
      <Link to={matchUrl} style={{ color: '#2196F3', fontSize: '0.85em' }}>
        {`Wedstrijd #${event.matchId}`}
      </Link>
    );
  };

  const content = getContent();

  return (
    <div
      style={{
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderLeft: '3px solid #2196F3',
      }}
    >
      <div style={{display: 'flex', alignItems: 'start', gap: 8}}>
        <span style={{fontSize: '1.2em'}}>{getEventIcon(event.type)}</span>
        <div style={{flex: 1}}>
          <div style={{fontSize: '0.85em', fontWeight: 'bold', color: '#333'}}>
            {event.createdBy}
          </div>
          <div style={{fontSize: '0.8em', color: '#666', marginTop: 2}}>
            {getTitle()}
          </div>
          {(event.type === 'MatchReport' || event.type === 'MatchComment') && (
            <div style={{marginTop: 2}}>
              {getMatchInfo()}
            </div>
          )}
          {content && (
            <div style={{fontSize: '0.8em', color: '#555', marginTop: 4}}>
              <div
                dangerouslySetInnerHTML={{ __html: content.html }} // eslint-disable-line react/no-danger
                style={{
                  maxHeight: expanded ? 'none' : '4.5em',
                  overflow: 'hidden',
                }}
              />
              {content.isTruncated && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2196F3',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '0.9em',
                    marginTop: 2,
                  }}
                >
                  {expanded ? 'minder' : 'meer'}
                </button>
              )}
            </div>
          )}
          <div style={{fontSize: '0.75em', color: '#999', marginTop: 4}}>
            <TimeAgo date={event.createdOn} />
          </div>
        </div>
      </div>
    </div>
  );
};
