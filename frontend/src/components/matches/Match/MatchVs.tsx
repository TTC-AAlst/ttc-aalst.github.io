import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import cn from 'classnames';
import {Icon} from '../../controls/Icons/Icon';
import {DivisionRankingLabel, OurDivisionRankingLabel} from '../controls/DivisionRankingLabel';
import {IMatch, OwnTeamLink} from '../../../models/model-interfaces';
import { browseTo } from '../../../routes';
import { t } from '../../../locales';


type MatchVsProps = {
  match: IMatch;
  opponentOnly?: boolean;
  themOnly?: boolean;
  ownTeamLink?: OwnTeamLink;
  withLinks?: boolean;
  withPosition?: boolean;
}

type MatchVsState = {
  themOnly: boolean;
  opponentOnly: boolean;
  withPosition: boolean;
}

export default class MatchVs extends Component<MatchVsProps, MatchVsState> {
  static defaultProps = {
    themOnly: false,
    opponentOnly: false,
    withPosition: true,
  };

  render() {
    const {match, opponentOnly, themOnly} = this.props;
    const team = match.getTeam();
    const divisionRanking = team.getDivisionRanking(match.opponent);
    let them = (
      <span>
        {this.props.withPosition && !divisionRanking.empty ? <DivisionRankingLabel divisionRanking={divisionRanking} /> : null}

        {this.props.withLinks ? (
          <Link className="link-hover-underline" to={browseTo.getOpponent(match.competition, match.opponent)}>
            {match.renderOpponentTitle()}
          </Link>
        ) : (
          match.renderOpponentTitle()
        )}
      </span>
    );

    if (!divisionRanking.empty && divisionRanking.isForfait) {
      them = <s>{them}</s>;
    }

    if (themOnly) {
      return <span>{them}</span>;
    }


    const usClasses = cn('badge label-as-badge bg-info', {clickable: !!this.props.ownTeamLink});
    let us;
    if (this.props.ownTeamLink) {
      us = (
        <Link to={browseTo.getTeam(team, this.props.ownTeamLink)} className={usClasses}>
          <OurDivisionRankingLabel team={team} />
          <span style={{fontSize: 14}}>{team.renderOwnTeamTitle()}</span>
        </Link>
      );

    } else {
      us = (
        <span className={usClasses} style={{fontSize: 14}}>
          <OurDivisionRankingLabel team={team} />
          {team.renderOwnTeamTitle()}
        </span>
      );
    }

    if (!match.shouldBePlayed) {
      return us;
    }

    if (opponentOnly) {
      return (
        <span>
          {match.isHomeMatch ? <Icon fa="fa fa-home" style={{marginRight: 5}} tooltip={t('common.matchAtHome')} /> : null}
          {them}
        </span>
      );
    }

    const separator = <Icon fa="fa fa-arrows-h" />;
    if (match.isHomeMatch) {
      return <span>{us} {separator} {them}</span>;
    }
    return <span>{them} {separator} {us}</span>;
  }
}
