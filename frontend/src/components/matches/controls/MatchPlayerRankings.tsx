import React, {Component} from 'react';
import {getMatchPlayerRankings} from '../../../storeUtil';
import {IMatch} from '../../../models/model-interfaces';

type PlayerRankingsProps = {
  formation: any[];
}

export class PlayerRankings extends Component<PlayerRankingsProps> {
  render() {
    const {formation, ...props} = this.props;

    return (
      <span {...props}>
        {formation.map(({ranking, amount}, index) => (
          <span key={ranking}>
            {amount > 1 ? <small>{amount}x</small> : null}
            {ranking}
            {index < formation.length - 1 ? ', ' : null}
          </span>
        ))}
      </span>
    );
  }
}


type MatchPlayerRankingsProps = {
  homeTeam: boolean;
  match: IMatch;
}

export class MatchPlayerRankings extends Component<MatchPlayerRankingsProps> {
  render() {
    const formation = getMatchPlayerRankings(this.props.match, this.props.homeTeam);
    return <PlayerRankings formation={formation} />;
  }
}
