import React, {Component} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import cn from 'classnames';
import MatchForm from './MatchForm';
import {MatchScore} from '../MatchScore';
import {TheirTeamTitle} from './TheirTeamTitle';
import {ThrillerBadge, ThrillerIcon} from '../../controls/Icons/ThrillerIcon';
import {CommentIcon} from '../../controls/Icons/CommentIcon';
import {IMatch} from '../../../models/model-interfaces';
import {IUser} from '../../../models/UserModel';
import { t } from '../../../locales';
import { browseTo } from '../../../routes';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';

const thrillerIconWith = 25;
const ThrillerIconSpan = <span key="1" style={{width: thrillerIconWith, float: 'left'}}>&nbsp;</span>;

type BigMatchCardHeaderProps = {
  /** Called match2 because withRouter injected a match prop */
  match2: IMatch;
  children?: any;
  user: IUser;
  isOpen: boolean;
}

/** BigMatchCardHeader == MatchesToday on Club monitor */
export class BigMatchCardHeader extends Component<BigMatchCardHeaderProps> {
  render() {
    const match = this.props.match2;
    const team = match.getTeam();
    const us = team.renderOwnTeamTitle();
    const them = match.renderOpponentTitle();

    return (
      <div className="match-card" style={{backgroundColor: '#fafafa'}}>
        <div className="match-card-header">
          <span className="big">
            <ThrillerBadge match={match} />
            <span className="match-title">{match.isHomeMatch ? `${us} vs ${them}` : `${them} vs ${us}`}</span>
          </span>
          <div className="match-card-score big">
            <MatchForm match={match} user={this.props.user} big />
          </div>
        </div>
        {this.props.isOpen ? (
          <div className="match-card-body">
            {this.props.children}
          </div>
        ) : null}
      </div>
    );
  }
}


type SmallMatchCardHeaderProps = Omit<BigMatchCardHeaderProps, 'user'> & {
  noScoreEdit?: boolean;
  width?: number;
  forceEdit?: boolean;
}


export const SmallMatchCardHeader = ({match2, ...props}: SmallMatchCardHeaderProps) => {
  const navigate = useNavigate();
  const hasNewComment = useTtcSelector(state => state.config.newMatchComments[match2.id]);
  const user = useTtcSelector(selectUser);

  const onOpen = (/* isOpen */) => {
    const matchRoute = t.route('match', {matchId: match2.id});
    navigate(matchRoute);
  };

  const newProps = {match: match2, onOpen: () => onOpen(), hasNewComment, user, ...props};
  return <MatchCardHeader {...newProps} />;
};


type MatchCardHeaderProps = {
  hasNewComment: boolean;
  match: IMatch;
  children?: any;
  user: IUser;
  isOpen: boolean;
  forceEdit?: boolean;
  onOpen: Function;
  noScoreEdit?: boolean;
}

class MatchCardHeader extends Component<MatchCardHeaderProps> {
  render() {
    const {match} = this.props;
    const iPlay = this.props.user.playsIn(match.teamId);

    const scoreFormVisible = !this.props.noScoreEdit
      && (match.isBeingPlayed() || this.props.forceEdit)
      && this.props.user.canChangeMatchScore(this.props.match);

    const subtitle: React.ReactNode[] = [];
    subtitle.push(ThrillerIconSpan);
    subtitle.push(<span key="2">{t('match.date', match.getDisplayDate())}</span>);

    if (match.comments.length || match.description) {
      const {hasNewComment} = this.props;
      subtitle.push(
        <span key="3" style={{marginLeft: 9, color: hasNewComment ? '#E3170D' : '#d3d3d3'}}>
          {match.comments.length ? <small>{match.comments.length}</small> : null}
          <CommentIcon tooltip={hasNewComment ? 'match.hasNewComments' : undefined} />
        </span>,
      );
    }

    const canOpen = !!this.props.onOpen && !this.props.isOpen;
    const cardHeaderAsButtonProps = canOpen ? {role: 'button', onClick: e => this._onExpandChange(e)} : undefined;
    return (
      <div className="match-card" style={{backgroundColor: iPlay ? '#F0F0F0' : '#fafafa'}}>
        <div
          className="match-card-header"
          {...cardHeaderAsButtonProps}
        >
          <span>
            <MatchCardHeaderSmallTitle match={match} withLinks={this.props.isOpen} />
            <div className="match-card-header-subtitle">{subtitle}</div>
          </span>

          {scoreFormVisible ? (
            <div className="match-card-score">
              <MatchForm match={match} user={this.props.user} />
            </div>
          ) : (
            <MatchScore match={match} className="score-as-badge" />
          )}
        </div>
        {this.props.isOpen ? (
          <div className="match-card-body">
            {this.props.children}
          </div>
        ) : null}
      </div>
    );
  }

  _onExpandChange(event) {
    const {nodeName} = event.target;
    if (nodeName === 'INPUT' || nodeName === 'A' || nodeName === '') {
      return;
    }

    if (this.props.onOpen) {
      this.props.onOpen(true);
    }
  }
}


type MatchCardHeaderSmallTitleProps = {
  match: IMatch;
  withLinks: boolean;
};

const MatchCardHeaderSmallTitle = ({match, withLinks}: MatchCardHeaderSmallTitleProps) => {
  const team = match.getTeam();

  const ourTitle = <OwnTeamTitle match={match} withLinks={withLinks} />;
  const theirTitle = <TheirTeamTitle match={match} withLinks={withLinks} />;

  return (
    <div style={{whiteSpace: 'nowrap'}}>
      {team.getThriller(match) ? <ThrillerIcon color="red" /> : ThrillerIconSpan}

      {match.isHomeMatch ? ourTitle : theirTitle}

      <span style={{marginLeft: 7, marginRight: 7}}>
        {t('match.vs')}
      </span>

      {!match.isHomeMatch ? ourTitle : theirTitle}
    </div>
  );
};


type OwnTeamTitleProps = {
  match: IMatch;
  withLinks: boolean;
}

const OwnTeamTitle = ({match, withLinks}: OwnTeamTitleProps) => {
  const team = match.getTeam();
  const divisionRanking = team.getDivisionRanking();

  const title = team.renderOwnTeamTitle();
  if (!withLinks) {
    return <span>{title}</span>;
  }

  return (
    <span>
      {!divisionRanking.empty && divisionRanking.position ? <small>{`${divisionRanking.position}. `}</small> : ''}
      <Link to={browseTo.getTeam(team)} className="link-hover-underline">
        {title}
      </Link>
    </span>
  );
};
