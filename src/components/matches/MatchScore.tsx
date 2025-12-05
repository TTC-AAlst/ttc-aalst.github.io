import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { Icon } from '../controls/Icons/Icon';
import { TrophyIcon } from '../controls/Icons/TrophyIcon';
import { CommentIcon } from '../controls/Icons/CommentIcon';
import { IMatch } from '../../models/model-interfaces';
import { t } from '../../locales';
import { useViewport } from '../../utils/hooks/useViewport';

function getClassName(isHomeMatch: boolean, home: number, out: number): 'match-won' | 'match-lost' | 'match-draw' {
  if (home === out) {
    return 'match-draw';
  }
  let won = home > out;
  if (!isHomeMatch) {
    won = !won;
  }
  return won ? 'match-won' : 'match-lost';
}


type MatchScoreProps = {
  match: IMatch;
  style?: React.CSSProperties;
  className?: string,
  forceDisplay?: boolean,
  showComments?: boolean,
  showThrophy?: boolean,
}

export const MatchScore = ({showThrophy = true, ...props}: MatchScoreProps) => {
  const viewport = useViewport();

  let match: IMatch | undefined;
  match = props.match;
  if (!props.forceDisplay) {
    if (!match.score || (match.score.home === 0 && match.score.out === 0)) {
      match = match.getPreviousMatch();
      if (!match || !match.score || (match.score.home === 0 && match.score.out === 0)) {
        return null;
      }
      const classColor2 = props.match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, match.score.home, match.score.out);
      return (
        <Link to={t.route('match', {matchId: match.id})}>
          <span
            className={cn('badge label-as-badge clickable', classColor2, props.className)}
            title={t('match.previousEncounterScore')}
            style={props.style}
          >

            <Icon fa="fa fa-long-arrow-left" style={{marginRight: 7}} />
            <span>{match.renderScore()}</span>
          </span>
        </Link>
      );
    }
  }

  const score = match.score || {home: 0, out: 0};
  const classColor = match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, score.home, score.out);
  return (
    <Link to={t.route('match', {matchId: match.id})}>
      <span
        className={cn('badge label-as-badge clickable', props.className, classColor)}
        style={props.style}
      >
        <span>
          {classColor === 'match-won' && !match.isDerby && viewport.width > 350 && showThrophy ? (
            <TrophyIcon style={{marginRight: 7, fontWeight: 'normal'}} color="#FFE568" />
          ) : null}
          {`${score.home} - ${score.out}`}
          {props.showComments && (match.comments.length || match.description) ? (
            <CommentIcon style={{marginLeft: 8}} tooltip={t('match.scoreComment')} />
          ) : null}
        </span>
      </span>
    </Link>
  );
};
