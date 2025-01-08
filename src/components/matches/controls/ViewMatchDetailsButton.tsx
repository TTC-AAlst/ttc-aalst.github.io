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
}

export const MatchOtherRoundButton = ({match}: MatchOtherRoundButtonProps) => {
  const opponentMatches = useTtcSelector(state => selectOpponentMatches(state, match));
  const matches = opponentMatches.away.concat(opponentMatches.home)
    .filter(m => m.id !== match.id);

  const firstRoundMatchInfo = matches.find(m => (
    (m.home.clubId === OwnClubId && m.home.teamCode === match.getTeam().teamCode)
    || (m.away.clubId === OwnClubId && m.away.teamCode === match.getTeam().teamCode)
  ));

  const firstRoundMatch = firstRoundMatchInfo ? storeUtil.getMatch(firstRoundMatchInfo.id) : null;
  if (!firstRoundMatch) {
    return null;
  }

  const wasPrev = match.date > firstRoundMatch.date;
  return (
    <Link to={t.route('match', {matchId: firstRoundMatch.id})}>
      <button type="button" className="btn btn-outline-secondary" style={{margin: 7}}>
        <div>
          <span style={{marginRight: 6}}>{t(`match.${wasPrev ? 'gotoPreviousEncounter' : 'gotoNextEncounter'}`)}</span>
          <MatchScore match={firstRoundMatch} forceDisplay />
        </div>
      </button>
    </Link>
  );
};
