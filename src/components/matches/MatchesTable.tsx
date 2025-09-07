/* eslint-disable no-nested-ternary */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import MatchVs from './Match/MatchVs';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import {PlayerCompetitionBadge, PlayerCompetitionButton} from '../players/PlayerBadges';
import OwnPlayer from './Match/OwnPlayer';
import {ThrillerIcon} from '../controls/Icons/ThrillerIcon';
import {MatchDate} from './controls/MatchDate';
import {FrenoyWeekLink} from '../controls/Buttons/FrenoyButton';
import {ViewMatchDetailsButton} from './controls/ViewMatchDetailsButton';
import {CannotEditMatchIcon} from './controls/CannotEditMatchIcon';
import {OpenMatchForEditButton} from './controls/OpenMatchForEditButton';
import {SaveMatchButtons} from './controls/SaveMatchButtons';
import { t } from '../../locales';
import { IMatch, IMatchPlayerInfo, ITeam, ITeamPlayerInfo, PickedPlayer } from '../../models/model-interfaces';
import { Viewport } from '../../utils/hooks/useViewport';
import UserModel from '../../models/UserModel';
import storeUtil from '../../storeUtil';
import { RootState } from '../../store';
import { editMatchPlayers } from '../../reducers/matchesReducer';
import { MatchesTablePlayerLineUp } from './MatchesTable/MatchesTablePlayerLineUp';

function isPickedForMatch(status) {
  return status === 'Play' || status === 'Captain' || status === 'Major';
}

type MatchesTableProps = {
  matches: IMatch[],
  allowOpponentOnly?: boolean, // Allow "MatchVs" to display just against whom on small devices
  viewport: Viewport,
  user: UserModel,
  editMode?: boolean,
  editMatchPlayers: typeof editMatchPlayers,

  tableForm?: boolean,
  team: ITeam,
  onTablePlayerSelect?: (players: PickedPlayer[], match: IMatch) => void,
  tablePlayers?: PickedPlayer[],
  striped?: boolean,
  ownTeamLink?: 'main' | 'matches' | 'ranking' | 'players' | 'matchesTable' | 'week',
}


type MatchesTableState = {
  editMatch: IMatch | any;
  players: PickedPlayer[];
  comment: {edit: boolean, value: string};
  playersEdit: PickedPlayer[];
}


class MatchesTable extends Component<MatchesTableProps, MatchesTableState> {
  static defaultProps = {
    allowOpponentOnly: false,
    editMode: false,
    tableForm: false,
    striped: false,
    ownTeamLink: 'main' as const,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMatch: {},
      players: [],
      comment: {edit: false, value: ''},
      playersEdit: [],
    };
  }

  _renderEditMatchPlayers() {
    const match = this.state.editMatch;
    return (
      <div style={{marginBottom: 4}}>
        <h4>{t('match.plys.choiceCaptain')}</h4>
        {this.state.playersEdit.map(plyInfo => (
          <PlayerCompetitionButton
            plyInfo={plyInfo}
            isPicked={isPickedForMatch(plyInfo.matchPlayer.status)}
            actionIconClass="fa fa-trash-o"
            onButtonClick={this._togglePlayer.bind(this, plyInfo.player.id)}
            competition={match.competition}
            style={{marginRight: 5}}
            key={plyInfo.player.id}
          />
        ))}

        <h4>{t('match.plys.choicePlayers')}</h4>
        {this.state.players.map(plyInfo => (
          <PlayerCompetitionButton
            plyInfo={plyInfo}
            isPicked={!!this.state.playersEdit.find(x => x.id === plyInfo.id)}
            actionIconClass="fa fa-thumbs-o-up"
            onButtonClick={this._togglePlayer.bind(this, plyInfo.player.id)}
            style={{marginRight: 5}}
            key={plyInfo.player.id}
            competition={match.competition}
          />
        ))}

        <br />
        <PlayerAutoComplete
          selectPlayer={playerId => typeof playerId === 'number' && this._togglePlayer(playerId)}
          label={t('match.chooseOtherPlayer')}
          competition={match.competition}
        />
      </div>
    );
  }

  _onOpenEditMatchForm(match: IMatch) {
    const team = match.getTeam();
    const userStatus = this._getUserStatus();

    const toDontKnowPlayer = (teamPlayer: ITeamPlayerInfo): IMatchPlayerInfo => ({
      id: teamPlayer.player.id,
      player: teamPlayer.player,
      matchPlayer: {
        id: 0,
        matchId: match.id,
        status: 'DontKnow',
        statusNote: '',
        position: 0,
        name: teamPlayer.player.name,
        ranking: teamPlayer.player[match.competition.toLowerCase()]?.ranking || '',
        uniqueIndex: 0,
        won: 0,
        home: true,
        playerId: teamPlayer.player.id,
        alias: teamPlayer.player.alias,
      },
    });

    const playerChoices = match.getPlayerFormation('Play');
    const playerChoicesPlayerIds = playerChoices.map(x => x.player.id);
    const playersWithoutChoice = team.getPlayers().filter(x => playerChoicesPlayerIds.indexOf(x.player.id) === -1);

    let playersEdit = match.getPlayerFormation(userStatus);
    if (playersEdit.length === 0) {
      if (userStatus === 'Major') {
        playersEdit = match.getPlayerFormation('Captain');
      }
    }

    this.setState({
      editMatch: match,
      players: playerChoices.concat(playersWithoutChoice.map(toDontKnowPlayer)).map(x => ({...x, matchId: match.id})),
      playersEdit: playersEdit.map(pe => ({...pe, matchId: match.id})),
      comment: {edit: false, value: match.formationComment || ''},
    });
  }

  _togglePlayer(playerId: number) {
    const ply = this.state.playersEdit.find(x => x.id === playerId);
    if (ply) {
      this.setState(prevState => ({playersEdit: prevState.playersEdit.filter(x => x !== ply)}));

    } else {
      const plyInfo = {
        id: playerId,
        matchId: this.state.editMatch.id,
        player: storeUtil.getPlayer(playerId),
        matchPlayer: {status: this._getUserStatus(), statusNote: ''},
      };
      this.setState(prevState => ({playersEdit: prevState.playersEdit.concat([plyInfo])}));
    }
  }

  _saveFormation({blockAlso, closeForm}) {
    this.props.editMatchPlayers({
      matchId: this.state.editMatch.id,
      playerIds: this.state.playersEdit.map(x => x.id),
      blockAlso,
      newStatus: this._getUserStatus(),
      comment: this.state.comment.value,
    });

    if (closeForm) {
      this.setState({editMatch: {}, players: [], playersEdit: []});
    }
  }

  _getUserStatus(): 'Major' | 'Captain' {
    return this.props.user.canManageTeams() ? 'Major' : 'Captain';
  }

  render() {
    const matchRows: any[] = [];

    const viewWidth = this.props.viewport.width;
    const showDate = viewWidth > 350 || this.props.matches.some(match => !match.isSyncedWithFrenoy);

    this.props.matches.forEach((match, i) => {
      const singleMatchRows: any[] = [];

      const stripeColor = {backgroundColor: i % 2 === 0 ? '#f9f9f9' : undefined};
      if (this.props.user.playerId && !this.props.striped) {
        const playsThisMatch = match.plays(this.props.user.playerId);
        const playsThisTeam = match.getTeam().plays(this.props.user.playerId);
        stripeColor.backgroundColor = playsThisMatch || playsThisTeam ? '#f9f9f9' : undefined;
      }

      let thrillerIcon: any;
      if (match.shouldBePlayed) {
        const team = match.getTeam();
        if (team.getThriller(match)) {
          thrillerIcon = <ThrillerIcon color="red" />;
        }
      }

      // Complexity galore
      singleMatchRows.push(
        <tr key={match.id} style={stripeColor}>
          {showDate ? (
            <td>
              {thrillerIcon}
              {match.shouldBePlayed ? <MatchDate match={match} /> : null}
            </td>
          ) : null}
          <td className="d-none d-sm-table-cell"><FrenoyWeekLink match={match} /></td>
          <td>
            <MatchVs
              match={match}
              opponentOnly={this.props.allowOpponentOnly && viewWidth < 450}
              ownTeamLink={this.props.ownTeamLink}
              withLinks
              withPosition={viewWidth > 400}
            />
          </td>
          <td>
            {!this.props.editMode || match.isSyncedWithFrenoy ? (
              <ViewMatchDetailsButton match={match} size={viewWidth < 600 ? 'sm' : null} />

            ) : !this.props.user.canEditMatchPlayers(match) ? (
              <CannotEditMatchIcon />

            ) : this.state.editMatch.id !== match.id ? (
              <OpenMatchForEditButton onClick={this._onOpenEditMatchForm.bind(this, match)} match={match} />

            ) : (
              <SaveMatchButtons
                onSave={this._saveFormation.bind(this, {blockAlso: false, closeForm: true})}
                onBlock={this._saveFormation.bind(this, {blockAlso: true, closeForm: true})}
                onCommentsToggle={() => this.setState(prevState => ({comment: {...prevState.comment, edit: !prevState.comment.edit}}))}
              />
            )}
          </td>
        </tr>,
      );

      // Match formation comments row
      if (this.props.editMode && this.props.user.canEditMatchPlayers(match)
        && ((this.state.editMatch.id === match.id && (this.state.comment.edit || this.state.comment.value)) || match.formationComment)) {

        singleMatchRows.push(
          <tr key={`${match.id}_b`} style={stripeColor}>
            <td colSpan={4} style={{border: 'none'}}>
              {this.state.editMatch.id === match.id ? (
                <CommentForm model={this.state.comment} onUpdate={model => this.setState({comment: model})} />
              ) : (
                <i>{match.formationComment}</i>
              )}
            </td>
          </tr>,
        );
      }

      // Display the players of the match
      const isMatchInEdit = this.props.editMode && this.state.editMatch.id === match.id && this.props.user.canEditMatchPlayers(match);
      if (isMatchInEdit || match.block || match.isSyncedWithFrenoy) {
        singleMatchRows.push(
          <tr key={`${match.id}_c`} style={stripeColor}>
            <td colSpan={4} style={{border: 'none'}}>
              {isMatchInEdit ? this._renderEditMatchPlayers() : <ReadOnlyMatchPlayers match={match} />}
            </td>
          </tr>,
        );
      }

      matchRows.push(
        <tbody key={match.id}>
          {singleMatchRows}
        </tbody>,
      );
    });

    if (this.props.tableForm) {
      if (this.props.editMode) {
        console.log('this.props.tablePlayers', this.props.tablePlayers);
        console.log('this.props.onTablePlayerSelect', this.props.onTablePlayerSelect);
      }


      return (
        <MatchesTablePlayerLineUp
          team={this.props.team}
          matches={this.props.matches}
          editMode={!!this.props.editMode}
        />
      );
    }

    return (
      <Table className="matches-table">
        <thead>
          <tr>
            {showDate ? <th>{t('common.date')}</th> : null}
            <th className="d-none d-sm-table-cell">{t('common.frenoy')}</th>
            <th>{t('teamCalendar.match')}</th>
            <th>{this.props.editMode ? t('match.plys.blockMatchTitle') : t('teamCalendar.score')}</th>
          </tr>
        </thead>
        {matchRows}
      </Table>
    );
  }
}


const mapDispatchToProps = (dispatch: any) => ({
  editMatchPlayers: (data: Parameters<typeof editMatchPlayers>[0]) => dispatch(editMatchPlayers(data)),
});

export default connect((state: RootState) => ({user: new UserModel(state.user)}), mapDispatchToProps)(MatchesTable);



const ReadOnlyMatchPlayers = ({match}: {match: IMatch}) => {
  if (match.isSyncedWithFrenoy) {
    return (
      <div style={{marginBottom: 4}}>
        {match.getOwnPlayers().map(ply => (
          <div style={{display: 'inline-block', marginRight: 7}} key={`ply-${ply.playerId}`}>
            <OwnPlayer match={match} ply={ply} />
          </div>
        ))}
      </div>
    );
  }

  const players = match.getPlayerFormation(undefined);
  return (
    <div style={{marginBottom: 4}}>
      {players.map(plyInfo => (
        <PlayerCompetitionBadge
          plyInfo={plyInfo}
          competition={match.competition}
          style={{marginBottom: 4, marginRight: 5}}
          key={`ply-${plyInfo.player.id}`}
        />
      ))}
    </div>
  );
};


type CommentFormProps = {
  model: {edit: boolean, value: string},
  onUpdate: (comment: {edit: boolean, value: string}) => void,
}


const CommentForm = ({model, onUpdate}: CommentFormProps) => (
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
