import React, {Component} from 'react';
import {FrenoyLink} from '../../controls/Buttons/FrenoyButton';
import {Competition, IMatchPlayer, Translator} from '../../../models/model-interfaces';

type OpponentPlayerLabelProps = {
  player: IMatchPlayer;
  competition: Competition;
  fullName?: boolean;
}

export class OpponentPlayerLabel extends Component<OpponentPlayerLabelProps> {
  static defaultProps = {
    fullName: true,
  };

  render() {
    const {competition, player, fullName} = this.props;
    return (
      <span>
        <span style={{marginRight: 7}}>{fullName ? player.name : player.alias}</span>
        <FrenoyLink competition={competition} uniqueIndex={player.uniqueIndex}>
          {player.ranking}
          &nbsp;
        </FrenoyLink>
      </span>
    );
  }
}


type OpponentPlayerProps = {
  t: Translator;
  ply: IMatchPlayer;
  competition: Competition;
  fullName?: boolean;
}

const OpponentPlayer = ({ply, t, competition, fullName = true}: OpponentPlayerProps) => (
  <div>
    <OpponentPlayerLabel player={ply} competition={competition} fullName={fullName} />
    <small style={{marginLeft: 7}}> {ply.won ? t('match.enemyVictory', ply.won) : null}</small>
  </div>
);

export default OpponentPlayer;
