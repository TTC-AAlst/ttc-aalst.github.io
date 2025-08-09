/* eslint-disable no-nested-ternary */
import React, {Component} from 'react';
import moment from 'moment';
import cn from 'classnames';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import {getPlayingStatusClass} from '../../models/PlayerModel';
import {CommentButton} from '../controls/Buttons/CommentButton';
import MatchVs from '../matches/Match/MatchVs';
import {CannotEditMatchIcon} from '../matches/controls/CannotEditMatchIcon';
import {SwitchBetweenFirstAndLastRoundButton, getFirstOrLastMatches, getFirstOrLast} from '../teams/SwitchBetweenFirstAndLastRoundButton';
import { t } from '../../locales';
import { selectPlayer } from '../../reducers/matchesReducer';
import { IMatch, ITeam } from '../../models/model-interfaces';

type PlayerLineupProps = {
  selectPlayer: typeof selectPlayer,
  playerId: number,
  teams: ITeam[],
}

type PlayerLineupState = {
  filter: string | null;
  showCommentId: number;
  comment: string;
  matchesFilter: ReturnType<typeof getFirstOrLast>;
}


class PlayerLineup extends Component<PlayerLineupProps, PlayerLineupState> {
  constructor(props) {
    super(props);
    this.state = {
      filter: null,
      showCommentId: 0,
      comment: '',
      matchesFilter: getFirstOrLast(),
    };
  }

  _onChangePlaying(match: IMatch, status, comment: string) {
    this.props.selectPlayer({
      matchId: match.id,
      status,
      statusNote: this.state.showCommentId ? this.state.comment : (comment || ''),
      playerId: this.props.playerId,
    });
    this.setState({showCommentId: 0, comment: ''});
  }

  render() {
    let {teams} = this.props;
    if (this.state.filter) {
      teams = teams.filter(x => x.competition === this.state.filter);
    }

    const allMatchesToCome = teams
      .map(team => team.getMatches())
      .flat()
      .filter(match => moment().isBefore(match.date))
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());

    const {matches, hasMore} = getFirstOrLastMatches(allMatchesToCome, this.state.matchesFilter);
    const allText = t('common.all');
    const activeFilter = this.state.filter || allText;

    return (
      <div>
        {this.props.teams.length > 1 ? (
          <div className="btn-group" style={{padding: 5}}>
            {[allText, 'Vttl', 'Sporta'].map(button => (
              <button
                type="button"
                className={cn('btn', button === activeFilter ? 'btn-info' : 'btn-outline-secondary')}
                key={button}
                onClick={() => this.setState({filter: button === allText ? null : button})}
              >
                {button}
              </button>
            ))}
          </div>
        ) : null}

        <Table size="sm">
          <thead>
            <tr>
              <th className="d-none d-lg-table-cell">{t('common.frenoy')}</th>
              <th className="d-none d-sm-table-cell">{t('common.date')}</th>
              <th>{t('teamCalendar.match')}</th>
              <th>{t('profile.play.tableTitle')}</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => {
              const matchPlayer = match.plays(this.props.playerId);
              const statusNote = matchPlayer ? matchPlayer.statusNote : '';

              const getOnChangePlaying = status => this._onChangePlaying.bind(this, match, status, statusNote);
              let buttons;
              if (match.block) {
                buttons = <CannotEditMatchIcon />;
              } else {
                buttons = (
                  <ButtonToolbar>
                    <Button style={{marginBottom: 5, width: 90}} variant="success" onClick={getOnChangePlaying('Play')}>
                      {t('profile.play.canPlay')}
                    </Button>
                    <Button style={{marginBottom: 5, width: 90}} variant="danger" onClick={getOnChangePlaying('NotPlay')}>
                      {t('profile.play.canNotPlay')}
                    </Button>
                    <Button style={{marginBottom: 5, width: 90}} variant="info" onClick={getOnChangePlaying('Maybe')}>
                      {t('profile.play.canMaybe')}
                    </Button>
                    <Button style={{width: 90}} onClick={getOnChangePlaying('DontKnow')}>
                      {t('profile.play.canDontKnow')}
                    </Button>
                    {this.state.showCommentId !== match.id ? (
                      <CommentButton onClick={() => this.setState({showCommentId: match.id, comment: statusNote})} className="d-none d-sm-inline" />
                    ) : null}
                  </ButtonToolbar>
                );
              }

              return (
                <tr key={match.id} className={`table-${getPlayingStatusClass(matchPlayer?.status)}`}>
                  <td className="d-none d-lg-table-cell">{match.frenoyMatchId}</td>
                  <td className="d-none d-sm-table-cell">{t('match.date', match.getDisplayDate())}</td>
                  <td>
                    <span className="d-block d-md-none">
                      {t('match.date', match.getDisplayDate())}
                      <br />
                    </span>
                    <MatchVs match={match} />

                    {this.state.showCommentId !== match.id && !match.block ? (
                      <CommentButton
                        onClick={() => this.setState({showCommentId: match.id, comment: matchPlayer ? matchPlayer.statusNote : ''})}
                        className="d-block d-md-none"
                        style={{marginTop: 8}}
                      />
                    ) : null}
                    {this.state.showCommentId === match.id ? (
                      <div className="d-block d-md-none" style={{marginTop: 12}}>
                        <br />
                        <br />
                        <CommentEditForm onChange={e => this.setState({comment: e.target.value})} value={this.state.comment || ''} />
                      </div>
                    ) : matchPlayer && matchPlayer.statusNote ? (
                      <div className="d-block d-md-none">
                        <Comment matchPlayer={matchPlayer} />
                      </div>
                    ) : null}
                  </td>
                  <td style={{width: '1%'}} className="d-table-cell d-md-none">{buttons}</td>
                  <td className="d-none d-md-table-cell">
                    {buttons}
                    {this.state.showCommentId === match.id ? (
                      <CommentEditForm onChange={e => this.setState({comment: e.target.value})} value={this.state.comment || ''} />
                    ) : matchPlayer && matchPlayer.statusNote ? (
                      <Comment matchPlayer={matchPlayer} />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {hasMore ? (
          <SwitchBetweenFirstAndLastRoundButton setMatchesFilter={filter => this.setState({matchesFilter: filter})} matchesFilter={this.state.matchesFilter} />
        ) : null}
      </div>
    );
  }
}


const Comment = ({matchPlayer}: {matchPlayer: any}) => (
  <div>
    <strong>{t('profile.play.extraComment')}</strong>
    <br />
    {matchPlayer.statusNote}
  </div>
);


type CommentEditFormProps = {
  onChange: any;
  value: string;
};

const CommentEditForm = ({onChange, value}: CommentEditFormProps) => (
  <div>
    <Form.Label>{t('profile.play.extraCommentHelp')}</Form.Label>
    <FormControl
      type="text"
      value={value}
      placeholder={t('profile.play.extraComment')}
      onChange={onChange}
    />
  </div>
);

const mapDispatchToProps = (dispatch: any) => ({
  selectPlayer: (data: Parameters<typeof selectPlayer>[0]) => dispatch(selectPlayer(data)),
});

export default connect(null, mapDispatchToProps)(PlayerLineup);
