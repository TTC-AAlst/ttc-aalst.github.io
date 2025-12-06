import React, { useState } from 'react';
import {FrenoyLink} from '../../controls/Buttons/FrenoyButton';
import {Competition, IMatchPlayer, Translator} from '../../../models/model-interfaces';

type OpponentPlayerLabelProps = {
  player: IMatchPlayer;
  competition: Competition;
  fullName?: boolean;
}

export const OpponentPlayerLabel = ({ player, competition, fullName = true }: OpponentPlayerLabelProps) => {
  const [showFullName, setShowFullName] = useState(false);

  const displayName = fullName || showFullName ? player.name : player.alias;

  return (
    <span>
      {fullName ? (
        <span style={{ marginRight: 7 }}>{displayName}</span>
      ) : (
        <button
          type="button"
          onClick={() => setShowFullName(!showFullName)}
          style={{
            marginRight: 7,
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          {displayName}
        </button>
      )}
      <small>
        <FrenoyLink competition={competition} uniqueIndex={player.uniqueIndex}>
          {player.ranking}
          &nbsp;
        </FrenoyLink>
      </small>
    </span>
  );
};


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
