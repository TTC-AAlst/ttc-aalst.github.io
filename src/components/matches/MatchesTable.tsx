/* eslint-disable no-nested-ternary */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import {getPlayingStatusClass} from '../../models/PlayerModel';
import MatchVs from './Match/MatchVs';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import {TeamCaptainIcon} from '../players/PlayerCard';
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

  _getTablePlayers() {
    // Matches the sorting with the Excel output (which happens on the backend)
    const comp = this.props.team.competition === 'Sporta' ? 'sporta' : 'vttl';
    return this.props.team.getPlayers()
      .sort((a, b) => {
        const keyA = `${(a.type === 'Reserve' ? '1' : '0')}${a.player[comp]?.ranking}${a.player.alias}`;
        const keyB = `${(b.type === 'Reserve' ? '1' : '0')}${b.player[comp]?.ranking}${b.player.alias}`;
        return keyA.localeCompare(keyB);
      });
  }

  _getTablePlayerHeaders() {
    if (!this.props.team) {
      return [];
    }
    return this._getTablePlayers()
      .map(ply => (
        <th key={ply.player.id}>
          {ply.type === 'Captain' ? <TeamCaptainIcon /> : null}
          <span style={{fontStyle: ply.type === 'Reserve' ? 'italic' : undefined}}>{ply.player.alias}</span>
        </th>
      ));
  }

  _renderTableEditMatchPlayers(match: IMatch) {
    // console.log('--------------------------------');
    const majorFormation = match.getPlayerFormation(undefined);
    if (!this.props.editMode) {
      return this._getTablePlayers()
        .map(ply => {
          const playerDecision = majorFormation.find(frm => frm.id === ply.player.id);
          // if (playerDecision)
          //  console.log(match.frenoyMatchId, playerDecision.player.alias, playerDecision.matchPlayer.status);
          return (
            <td key={ply.player.id} className={`td-${getPlayingStatusClass(playerDecision?.matchPlayer.status)}`}>
              &nbsp;
            </td>
          );
        });
    }

    const formation = match.getPlayerFormation('Play');
    return this._getTablePlayers()
      .map(plyInfo => {
        const playerDecision = formation.find(frm => frm.id === plyInfo.player.id);
        const majorDecision = majorFormation.find(frm => frm.id === plyInfo.player.id);
        if (!this.props.user.canEditMatchPlayers(match)) {
          return (
            <td
              style={{textAlign: 'center'}}
              key={plyInfo.player.id}
              className={`td-${getPlayingStatusClass(playerDecision?.matchPlayer.status)}`}
            >
              {majorDecision ? <PlayerCompetitionBadge plyInfo={majorDecision} competition={match.competition} /> : null}
            </td>
          );
        }

        let captainDecision = this.props.tablePlayers?.find(frm => frm.matchId === match.id && frm.id === plyInfo.player.id);
        if (!captainDecision) {
          captainDecision = {
            id: plyInfo.player.id,
            matchId: match.id,
            matchPlayer: {status: '', statusNote: ''},
            player: plyInfo.player,
          };
          if (playerDecision?.matchPlayer.statusNote) {
            captainDecision.matchPlayer.statusNote = `${playerDecision.player.alias}: ${playerDecision?.matchPlayer.statusNote}`;
          }
        }

        const onButtonClick = this._toggleTablePlayer.bind(this, plyInfo.player.id, match);
        return (
          <td
            style={{textAlign: 'center'}}
            key={plyInfo.player.id}
            className={`td-${getPlayingStatusClass(playerDecision?.matchPlayer.status)}`}
          >
            <PlayerCompetitionButton
              plyInfo={captainDecision}
              isPicked={!!captainDecision.matchPlayer.status}
              actionIconClass="fa fa-thumbs-o-up"
              onButtonClick={onButtonClick}
              competition={match.competition}
            />
          </td>
        );
      });
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

  _toggleTablePlayer(playerId: number, match: IMatch) {
    if (!this.props.onTablePlayerSelect || !this.props.tablePlayers) {
      return;
    }

    const ply = this.props.tablePlayers?.find(x => x.id === playerId && x.matchId === match.id);
    if (ply) {
      this.props.onTablePlayerSelect(this.props.tablePlayers.filter(x => x !== ply), match);

    } else {
      const plyInfo = {
        id: playerId,
        matchId: match.id,
        player: storeUtil.getPlayer(playerId),
        matchPlayer: {status: this._getUserStatus(), statusNote: ''},
      };
      this.props.onTablePlayerSelect(this.props.tablePlayers.concat([plyInfo]), match);
    }
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

      const stripeColor = {backgroundColor: i % 2 === 0 && !this.props.tableForm ? '#f9f9f9' : undefined};
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
            {this.props.tableForm && this.props.editMode && match.getPlayerFormation(undefined).length < match.getTeamPlayerCount() && (
              <i className="fa fa-exclamation-circle" style={{color: 'red', float: 'right', fontSize: '1.5em', marginTop: 3}} />
            )}
          </td>
          {this.props.tableForm ? null : (
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
          )}
          {this.props.tableForm ? this._renderTableEditMatchPlayers(match) : null}
        </tr>,
      );

      // Match formation comments row
      if (!this.props.tableForm && this.props.editMode && this.props.user.canEditMatchPlayers(match)
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

      // Display the players of the match (non TableForm)
      const isMatchInEdit = this.props.editMode && this.state.editMatch.id === match.id && this.props.user.canEditMatchPlayers(match);
      if (!this.props.tableForm && (isMatchInEdit || match.block || match.isSyncedWithFrenoy)) {
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

    return (
      <Table className="matches-table">
        <thead>
          <tr>
            {showDate ? <th>{t('common.date')}</th> : null}
            <th className="d-none d-sm-table-cell">{t('common.frenoy')}</th>
            <th>{t('teamCalendar.match')}</th>
            {!this.props.tableForm ? <th>{this.props.editMode ? t('match.plys.blockMatchTitle') : t('teamCalendar.score')}</th> : null}
            {this.props.tableForm ? this._getTablePlayerHeaders() : null}
          </tr>
        </thead>
        {matchRows}
        {this.props.tableForm && this.props.editMode ? (
          <tr>
            <td colSpan={3}>&nbsp;</td>
            {this._getTablePlayers().map(ply => {
              const played = this.props.matches.filter(match => this.props.tablePlayers?.find(frm => frm.matchId === match.id && frm.id === ply.player.id));
              return (
                <td key={ply.player.id} style={{textAlign: 'center', fontWeight: 'bold'}}>{played.length}</td>
              );
            })}
          </tr>
        ) : null}
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
