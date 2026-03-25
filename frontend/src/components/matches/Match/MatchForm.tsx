import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MatchScore } from '../MatchScore';
import { Icon } from '../../controls/Icons/Icon';
import { IUser } from '../../../models/UserModel';
import { IMatch, IMatchScore } from '../../../models/model-interfaces';
import { updateScore } from '../../../reducers/matchesReducer';
import { debounce } from '../../../utils/debounce';
import { useTtcDispatch } from '../../../utils/hooks/storeHooks';

const scoreOrDefault = (match: IMatch): IMatchScore => match.score || { home: 0, out: 0 };

type MatchFormProps = {
  user: IUser;
  match: IMatch;
  big?: boolean;
};

const MatchForm = ({ user, match, big }: MatchFormProps) => {
  const dispatch = useTtcDispatch();
  const [useInput, setUseInput] = useState(false);
  const [inputScore, setInputScore] = useState('');
  const [currentScore, setCurrentScore] = useState<IMatchScore>(scoreOrDefault(match));

  useEffect(() => {
    setCurrentScore(scoreOrDefault(match));
  }, [match]);

  const dispatchUpdateScore = useCallback((data: Parameters<typeof updateScore>[0]) => dispatch(updateScore(data)), [dispatch]);

  const onUpdateScoreDebounced = useMemo(
    () =>
      debounce((matchScore: IMatchScore & { matchId: number }) => {
        dispatchUpdateScore(matchScore);
      }, 1000),
    [dispatchUpdateScore],
  );

  const onUpdateScore = (matchScore: IMatchScore & { matchId: number }, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentScore(matchScore);
    onUpdateScoreDebounced(matchScore);
  };

  const onOpenInputScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUseInput(prev => !prev);
  };

  const onInputScoreUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newScores = inputScore.split('-');
    if (newScores.length === 2) {
      const home = parseInt(newScores[0]?.trim() ?? '0', 10);
      const out = parseInt(newScores[1]?.trim() ?? '0', 10);
      dispatchUpdateScore({ matchId: match.id, home, out });
    }
    setUseInput(false);
  };

  const score = currentScore;
  const isEditable = user.canChangeMatchScore(match);

  if (useInput) {
    return (
      <form>
        <div className="form-group">
          <input onChange={e => setInputScore(e.target.value)} placeholder="xx-xx" style={{ width: 70, height: 30 }} />
          <button type="button" className="btn btn-outline-secondary" onClick={e => onInputScoreUpdate(e)} style={{ marginLeft: 7 }}>
            <Icon fa="fa fa-floppy-o" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`match-manipulator ${big ? 'big' : ''}`}>
      {isEditable ? (
        <MatchManipulation
          isHome
          plusClick={e => onUpdateScore({ matchId: match.id, home: score.home + 1, out: score.out }, e)}
          minClick={e => onUpdateScore({ matchId: match.id, home: score.home - 1, out: score.out }, e)}
        />
      ) : null}

      <div className="score" onClick={e => onOpenInputScore(e)} role="button" tabIndex={0}>
        <MatchScore match={match} forceDisplay style={{ fontSize: big ? 46 : 24 }} showThrophy={false} />
      </div>

      {isEditable ? (
        <MatchManipulation
          plusClick={e => onUpdateScore({ matchId: match.id, home: score.home, out: score.out + 1 }, e)}
          minClick={e => onUpdateScore({ matchId: match.id, home: score.home, out: score.out - 1 }, e)}
        />
      ) : null}
    </div>
  );
};

type MatchManipulationProps = {
  plusClick: (e: React.MouseEvent) => void;
  minClick: (e: React.MouseEvent) => void;
  isHome?: boolean;
};

const MatchManipulation = ({ plusClick, minClick, isHome }: MatchManipulationProps) => (
  <div className="manipulators">
    <Icon
      fa="fa fa-plus-circle fa-2x"
      onClick={e => plusClick(e)}
      translate
      tooltip={isHome ? 'match.scoreHomeUp' : 'match.scoreOutUp'}
      tooltipPlacement="left"
    />
    <Icon
      fa="fa fa-minus-circle fa-2x"
      onClick={e => minClick(e)}
      translate
      tooltip={isHome ? 'match.scoreHomeDown' : 'match.scoreOutDown'}
      tooltipPlacement="bottom"
    />
  </div>
);

export default MatchForm;
