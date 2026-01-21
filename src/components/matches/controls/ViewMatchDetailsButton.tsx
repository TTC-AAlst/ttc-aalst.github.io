import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { OwnClubId } from '../../../models/ClubModel';
import { MatchScore } from '../MatchScore';
import { IMatch } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import storeUtil from '../../../storeUtil';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';
import { selectOpponentMatches } from '../../../reducers/selectors/selectOpponentMatches';

type ViewMatchDetailsButtonProps = {
  match: IMatch;
  size: 'sm' | null;
}

export class ViewMatchDetailsButton extends Component<ViewMatchDetailsButtonProps> {
  render() {
    const {match} = this.props;
    if (!match.shouldBePlayed) {
      return null;
    }

    const {size} = this.props;
    const score = match.renderScore();
    return (
      <Link
        className={cn({'btn btn-outline-secondary': !score, clickable: !!score, [`btn-${size}`]: !!size})}
        to={t.route('match', {matchId: match.id})}
      >
        {score ? <MatchScore match={match} style={{fontSize: size === 'sm' ? 12 : 16}} showComments /> : t('match.details')}
      </Link>
    );
  }
}


type MatchOtherRoundButtonProps = {
  match: IMatch;
  /** Use short label ("Heenronde") instead of full label ("Details heenronde") */
  shortLabel?: boolean;
  /** Render as small button suitable for ButtonGroup */
  small?: boolean;
}

export const MatchOtherRoundButton = ({match, shortLabel, small}: MatchOtherRoundButtonProps) => {
  const opponentMatches = useTtcSelector(state => selectOpponentMatches(state, match));
  const matches = opponentMatches.away.concat(opponentMatches.home)
    .filter(m => m.id !== match.id);

  const firstRoundMatchInfo = matches.find(m => (
    (m.home.clubId === OwnClubId && m.home.teamCode === match.getTeam().teamCode)
    || (m.away.clubId === OwnClubId && m.away.teamCode === match.getTeam().teamCode)
  ));

  const otherRoundMatch = firstRoundMatchInfo ? storeUtil.getMatch(firstRoundMatchInfo.id) : null;
  if (!otherRoundMatch || !otherRoundMatch.isSyncedWithFrenoy) {
    return null;
  }

  const wasPrev = match.date > otherRoundMatch.date;
  let label: string;
  if (shortLabel) {
    label = otherRoundMatch.isHomeMatch ? t('match.thuis') : t('match.uit');
  } else {
    label = t(`match.${wasPrev ? 'gotoPreviousEncounter' : 'gotoNextEncounter'}`);
  }

  return (
    <Link
      to={t.route('match', {matchId: otherRoundMatch.id})}
      className={cn('btn btn-outline-secondary', {'btn-sm': small})}
      style={small ? undefined : {margin: 7}}
    >
      {label} <MatchScore match={otherRoundMatch} forceDisplay />
    </Link>
  );
};
