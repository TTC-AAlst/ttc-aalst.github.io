import React, {Component} from 'react';
import { connect } from 'react-redux';
import {SmallMatchCardHeader, BigMatchCardHeader} from './MatchCardHeader';
import MatchPlayerResults from './MatchPlayerResults';
import {IndividualMatches} from './IndividualMatches';
import {OpponentClubLocations} from './OpponentClubLocations';
import {SelectPlayersForm} from './SelectPlayersForm';
import {OpponentsLastMatches} from './OpponentsLastMatches';
import {OpponentsFormation} from './OpponentsFormation';
import {MatchReport} from './MatchReport';
import {Scoresheet} from './Scoresheet';
import {PlayersImageGallery} from '../../players/PlayersImageGallery';
import {MatchOtherRoundButton} from '../controls/ViewMatchDetailsButton';
import {MatchCardAdmin} from './MatchCardAdmin';
import {TabbedContainer} from '../../controls/TabbedContainer';
import {CommentIcon} from '../../controls/Icons/CommentIcon';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {IMatch} from '../../../models/model-interfaces';
import UserModel, {IUser} from '../../../models/UserModel';
import { t } from '../../../locales';
import { Viewport } from '../../../utils/hooks/useViewport';
import { RootState } from '../../../store';
import { setNewMatchComment, setSetting } from '../../../reducers/configReducer';
import { getOpponentMatches } from '../../../reducers/readonlyMatchesReducer';

const tabEventKeys = {
  players: 'players',
  individualMatches: 'individualMatches',
  report: 'report',
  opponentClub: 'opponentClub',
  scoresheet: 'scoresheet',
  opponentsRanking: 'opponentsRanking',
  opponentsFormation: 'opponentsFormation',
  admin: 'admin',
};

type MatchCardProps = {
  // Store mapped
  newComments: {[matchId: number]: boolean};
  user: IUser;

  getOpponentMatches: typeof getOpponentMatches;
  setSetting: typeof setSetting;
  setNewMatchComment: typeof setNewMatchComment;

  // Actual props
  viewport: Viewport;
  match: IMatch;
  viewportWidthContainerCount?: number;
  big?: boolean;
  isOpen?: boolean;
  params?: {tabKey?: string};
}

type MatchCardState = {
  forceEditPlayers: boolean;
}


class MatchCard extends Component<MatchCardProps, MatchCardState> {
  static defaultProps = {
    viewportWidthContainerCount: 1, // The amount of containers next to eachother that display a PlayersImageGallery
  };

  constructor(props) {
    super(props);
    this.state = {
      forceEditPlayers: false,
    };
  }

  componentDidMount() {
    this.props.getOpponentMatches({teamId: this.props.match.teamId, opponent: this.props.match.opponent});
  }

  render() {
    const {match} = this.props;

    const tabConfig = [{
      key: tabEventKeys.players,
      title: t('match.tabs.playersTitle'),
      label: t('match.tabs.players'),
      headerChildren: this._getPlayersEditIcon(),
    }, {
      key: tabEventKeys.report,
      title: t('match.tabs.reportTitle'),
      label: t('match.tabs.report'),
      headerChildren: this._getCommentsIcon(),
    }, {
      key: tabEventKeys.individualMatches,
      title: t('match.tabs.matchesTitle'),
      label: t('match.tabs.matches'),
      show: match.games.length !== 0,
    }, {
      key: tabEventKeys.scoresheet,
      title: t('match.tabs.scoresheet'),
      show: match.isBeingPlayed(),
    }, {
      key: tabEventKeys.opponentClub,
      title: t('match.tabs.clubTitle'),
      label: t('match.tabs.club'),
      show: !match.isHomeMatch && !match.isPlayed,
    }, {
      key: tabEventKeys.opponentsRanking,
      title: t('match.tabs.opponentsRankingTitle'),
      label: t('match.tabs.opponentsRanking'),
    }, {
      key: tabEventKeys.opponentsFormation,
      title: t('match.tabs.opponentsFormationTitle'),
      label: t('common.teamFormation'),
    }, {
      key: tabEventKeys.admin,
      title: 'admin',
      label: 'admin',
      show: this.props.user.isDev(),
    }];

    const tabbedContainer = (
      <TabbedContainer
        selectedTab={tabEventKeys.players}
        tabKeys={tabConfig}
        tabRenderer={evenyKey => this._renderTabContent(evenyKey)}
        onTabSelect={evenyKey => this._onTabSelect(evenyKey)}
        route={{base: t.route('match').replace(':matchId', match.id.toString()), subs: 'matchTabs'}}
        widthTreshold={700}
      />
    );

    if (this.props.big) {
      return (
        <BigMatchCardHeader
          {...this.props}
          match2={this.props.match}
          isOpen={!!this.props.isOpen}
        >
          {tabbedContainer}
        </BigMatchCardHeader>
      );
    }
    return (
      <SmallMatchCardHeader
        {...this.props}
        match2={this.props.match}
        isOpen={!!this.props.isOpen}
        forceEdit={this.state.forceEditPlayers}
      >
        {tabbedContainer}
      </SmallMatchCardHeader>
    );
  }

  _getCommentsIcon(): React.ReactNode {
    const hasNewComment = this.props.newComments[this.props.match.id];
    if (!hasNewComment) {
      return null;
    }
    return <CommentIcon className="match-card-tab-icon" />;
  }

  _getPlayersEditIcon() {
    const {match} = this.props;
    const isAllowedToEdit = this.props.user.canEditPlayersOnMatchDay(match);
    return isAllowedToEdit && !match.isSyncedWithFrenoy ? <EditIcon onClick={e => this._onStartEditPlayers(e)} className="match-card-tab-icon" /> : null;
  }

  _onStartEditPlayers(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState(prevState => ({forceEditPlayers: !prevState.forceEditPlayers}));
  }

  _onTabSelect(eventKey: string) {
    if (eventKey === tabEventKeys.report) {
      this.props.setNewMatchComment({matchId: this.props.match.id, isNew: false});
    }
  }

  _renderTabContent(eventKey: string) {
    switch (eventKey) {
      case tabEventKeys.players:
        return this._renderPlayers();

      case tabEventKeys.individualMatches:
        return <IndividualMatches match={this.props.match} ownPlayerId={this.props.user.playerId} />;

      case tabEventKeys.report:
        return <MatchReport match={this.props.match} />;

      case tabEventKeys.opponentClub:
        return <OpponentClubLocations club={this.props.match.getOpponentClub()} />;

      case tabEventKeys.scoresheet:
        return <Scoresheet match={this.props.match} />;

      case tabEventKeys.opponentsRanking:
        return this._renderOpponentsRanking();

      case tabEventKeys.opponentsFormation:
        return <OpponentsFormation match={this.props.match} opponent={this.props.match.opponent} />;

      case tabEventKeys.admin:
        return <MatchCardAdmin match={this.props.match} />;

      default:
        return <span>Unknown</span>;
    }
  }

  _renderOpponentsRanking() {
    return (
      <div>
        <MatchOtherRoundButton match={this.props.match} />
        <OpponentsLastMatches match={this.props.match} />
      </div>
    );
  }

  _renderPlayers() {
    const {match} = this.props;
    const team = match.getTeam();

    if (match.isSyncedWithFrenoy) {
      return <MatchPlayerResults match={match} />;
    }

    const playingPlayers = match.getPlayerFormation('onlyFinal').map(x => x.player);
    if (this.state.forceEditPlayers || (this.props.user.canEditPlayersOnMatchDay(match) && playingPlayers.length < team.getTeamPlayerCount())) {
      return <SelectPlayersForm match={match} />;
    }

    if (playingPlayers.length === 0) {
      const standardPlayers = team.getPlayers('standard').map(ply => ply.player);
      return (
        <PlayersImageGallery
          players={standardPlayers}
          competition={team.competition}
          viewportWidthContainerCount={this.props.viewportWidthContainerCount}
        />
      );
    }

    return (
      <PlayersImageGallery
        players={playingPlayers}
        competition={team.competition}
        viewportWidthContainerCount={this.props.viewportWidthContainerCount}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  setSetting: (data: Parameters<typeof setSetting>[0]) => dispatch(setSetting(data)),
  getOpponentMatches: (data: Parameters<typeof getOpponentMatches>[0]) => dispatch(getOpponentMatches(data)),
  setNewMatchComment: (data: Parameters<typeof setNewMatchComment>[0]) => dispatch(setNewMatchComment(data)),
});

export default connect((state: RootState) => ({
  newComments: state.config.newMatchComments,
  user: new UserModel(state.user),
}), mapDispatchToProps)(MatchCard);
