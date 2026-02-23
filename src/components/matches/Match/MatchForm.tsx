import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MatchScore } from '../MatchScore';
import { Icon } from '../../controls/Icons/Icon';
import { IUser } from '../../../models/UserModel';
import { IMatch, IMatchScore } from '../../../models/model-interfaces';
import { updateScore } from '../../../reducers/matchesReducer';
import { debounce } from '../../../utils/debounce';
import { AppDispatch } from '../../../store';

const scoreOrDefault = (match: IMatch): IMatchScore => match.score || { home: 0, out: 0 };

type MatchFormProps = {
  user: IUser;
  match: IMatch;
  updateScore: (data: Parameters<typeof updateScore>[0]) => void;
  big?: boolean;
};

type MatchFormState = {
  useInput: boolean;
  inputScore: string;
  currentScore: IMatchScore;
};

class MatchForm extends Component<MatchFormProps, MatchFormState> {
  constructor(props: MatchFormProps) {
    super(props);
    this.state = {
      useInput: false,
      inputScore: '',
      currentScore: scoreOrDefault(props.match),
    };
    this._onUpdateScoreDebounced = this._onUpdateScoreDebounced.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: MatchFormProps) {
    this.setState({ currentScore: scoreOrDefault(nextProps.match) });
  }

  render() {
    const { match } = this.props;
    const score = this.state.currentScore;
    const isEditable = this.props.user.canChangeMatchScore(match);

    if (this.state.useInput) {
      return (
        <form>
          <div className="form-group">
            <input onChange={e => this.setState({ inputScore: e.target.value })} placeholder="xx-xx" style={{ width: 70, height: 30 }} />
            <button type="button" className="btn btn-outline-secondary" onClick={e => this._onInputScoreUpdate(e)} style={{ marginLeft: 7 }}>
              <Icon fa="fa fa-floppy-o" />
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className={`match-manipulator ${this.props.big ? 'big' : ''}`}>
        {isEditable ? (
          <MatchManipulation
            isHome
            plusClick={this._onUpdateScore.bind(this, { matchId: match.id, home: score.home + 1, out: score.out })}
            minClick={this._onUpdateScore.bind(this, { matchId: match.id, home: score.home - 1, out: score.out })}
          />
        ) : null}

        <div className="score" onClick={e => this._onOpenInputScore(e)} role="button" tabIndex={0}>
          <MatchScore match={match} forceDisplay style={{ fontSize: this.props.big ? 46 : 24 }} showThrophy={false} />
        </div>

        {isEditable ? (
          <MatchManipulation
            plusClick={this._onUpdateScore.bind(this, { matchId: match.id, home: score.home, out: score.out + 1 })}
            minClick={this._onUpdateScore.bind(this, { matchId: match.id, home: score.home, out: score.out - 1 })}
          />
        ) : null}
      </div>
    );
  }

  _onOpenInputScore(e: React.MouseEvent) {
    e.stopPropagation();
    this.setState(prevState => ({ useInput: !prevState.useInput }));
  }

  _onInputScoreUpdate(e: React.MouseEvent) {
    e.stopPropagation();
    const newScores = this.state.inputScore.split('-');
    if (newScores.length === 2) {
      const home = parseInt(newScores[0]?.trim() ?? '0', 10);
      const out = parseInt(newScores[1]?.trim() ?? '0', 10);
      this.props.updateScore({ matchId: this.props.match.id, home, out });
    }
    this.setState({ useInput: false });
  }

  _onUpdateScore(matchScore: IMatchScore & { matchId: number }, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ currentScore: matchScore });
    this._onUpdateScoreDebounced(matchScore);
  }

  _onUpdateScoreDebounced = debounce((matchScore: IMatchScore & { matchId: number }) => {
    this.props.updateScore(matchScore);
  }, 1000);
}

type MatchManipulationProps = {
  plusClick: Function;
  minClick: Function;
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

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateScore: (data: Parameters<typeof updateScore>[0]) => dispatch(updateScore(data)),
});

export default connect(null, mapDispatchToProps)(MatchForm);
