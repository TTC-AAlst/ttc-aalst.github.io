import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { t } from '../../../locales';
import { IMatch, PickedPlayer } from '../../../models/model-interfaces';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { ReadOnlyMatchPlayers } from './MatchesTableCells';
import { PlayerAutoComplete } from '../../players/PlayerAutoComplete';
import { PlayerCompetitionButton } from '../../players/PlayerBadges';
import storeUtil from '../../../storeUtil';
import { MatchBlock } from '../Match/MatchBlock';

export type MatchCommentForm = {
  edit: boolean;
  value: string;
}

type CommentFormProps = {
  model: MatchCommentForm,
  onUpdate: (comment: MatchCommentForm) => void,
}


export const CommentForm = ({model, onUpdate}: CommentFormProps) => (
  <div style={{width: '50%'}}>
    {model.edit ? (
      <FormControl
        type="text"
        value={model.value}
        placeholder={t('match.plys.extraComment')}
        onChange={e => onUpdate({...model, value: e.target.value})}
      />
    ) : <i>{model.value}</i>}
  </div>
);


type MatchesTableCommentRowProps = {
  match: IMatch;
  editMatch: IMatch | null;
  comment: MatchCommentForm;
  setComment: (comment: MatchCommentForm) => void;
  stripeColor: React.CSSProperties;
}

export const MatchesTableCommentRow = ({match, editMatch, comment, setComment, stripeColor}: MatchesTableCommentRowProps) => {
  const user = useTtcSelector(selectUser);

  if (!user.canEditMatchPlayers(match)) {
    return null;
  }

  if ((editMatch?.id === match.id && (comment.edit || comment.value)) || match.formationComment) {
    return (
      <tr style={stripeColor}>
        <td colSpan={4} style={{border: 'none'}}>
          {editMatch?.id === match.id ? (
            <CommentForm model={comment} onUpdate={model => setComment(model)} />
          ) : (
            <i>{match.formationComment}</i>
          )}
        </td>
      </tr>
    );
  }

  return null;
};


type MatchesTableEditPlayersRowProps = {
  match: IMatch;
  editMatch: IMatch | null;
  stripeColor: React.CSSProperties;
  playersEdit: PickedPlayer[];
  players: PickedPlayer[];
  setPlayersEdit: (picked: PickedPlayer[]) => void;
}

export const MatchesTableEditPlayersRow = ({match, editMatch, stripeColor, ...props}: MatchesTableEditPlayersRowProps) => {
  const user = useTtcSelector(selectUser);
  const isMatchInEdit = editMatch?.id === match.id && user.canEditMatchPlayers(match);
  const tempLineUp = match.getPlayerFormation('Captain');
  if (isMatchInEdit || match.block || match.isSyncedWithFrenoy || tempLineUp.length) {
    return (
      <tr style={stripeColor}>
        <td colSpan={4} style={{border: 'none'}}>
          {!isMatchInEdit && <ReadOnlyMatchPlayers match={match} displayNonBlocked />}
          {isMatchInEdit && <EditMatchPlayers editMatch={editMatch} {...props} />}
        </td>
      </tr>
    );
  }

  return null;
};


function isPickedForMatch(status: string) {
  return status === 'Play' || status === 'Captain' || status === 'Major';
}

type EditMatchPlayersProps = {
  editMatch: IMatch;
  players: PickedPlayer[];
  playersEdit: PickedPlayer[];
  setPlayersEdit: (picked: PickedPlayer[]) => void;
}

const EditMatchPlayers = ({editMatch, players, playersEdit, setPlayersEdit}: EditMatchPlayersProps) => {
  const user = useTtcSelector(selectUser);

  const togglePlayer = (playerId: number) => {
    const ply = playersEdit.find(x => x.id === playerId);
    if (ply) {
      setPlayersEdit(playersEdit.filter(x => x !== ply));

    } else {
      const plyInfo = {
        id: playerId,
        matchId: editMatch?.id,
        player: storeUtil.getPlayer(playerId),
        matchPlayer: {status: user.canManageTeams() ? 'Major' as const : 'Captain' as const, statusNote: ''},
      };
      setPlayersEdit(playersEdit.concat([plyInfo]));
    }
  };


  return (
    <div style={{marginBottom: 4}}>
      <h4>{t('match.plys.choiceCaptain')}</h4>
      <span style={{display: 'inline-block', marginRight: 8, fontSize: 24, verticalAlign: 'middle'}}>
        <MatchBlock block={editMatch.block} displayNonBlocked />
      </span>
      {playersEdit.map(plyInfo => (
        <PlayerCompetitionButton
          plyInfo={plyInfo}
          isPicked={isPickedForMatch(plyInfo.matchPlayer.status)}
          actionIconClass="fa fa-trash-o"
          onButtonClick={togglePlayer.bind(this, plyInfo.player.id)}
          competition={editMatch.competition}
          style={{marginRight: 5}}
          key={plyInfo.player.id}
        />
      ))}

      <h4 style={{marginTop: 16}}>{t('match.plys.choicePlayers')}</h4>
      {players.map(plyInfo => (
        <PlayerCompetitionButton
          plyInfo={plyInfo}
          isPicked={!!playersEdit.find(x => x.id === plyInfo.id)}
          actionIconClass="fa fa-thumbs-o-up"
          onButtonClick={togglePlayer.bind(this, plyInfo.player.id)}
          style={{marginRight: 5}}
          key={plyInfo.player.id}
          competition={editMatch.competition}
        />
      ))}

      <br />
      <PlayerAutoComplete
        selectPlayer={playerId => typeof playerId === 'number' && togglePlayer(playerId)}
        label={t('match.chooseOtherPlayer')}
        competition={editMatch.competition}
      />
    </div>
  );
};
