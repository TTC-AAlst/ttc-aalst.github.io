import React, {Component} from 'react';
import cn from 'classnames';
import {Icon} from '../Icons/Icon';
import {createFrenoyLinkByUniqueId} from '../../../models/PlayerModel';
import {Competition, ITeam, IMatch} from '../../../models/model-interfaces';
import { t } from '../../../locales';

export const FrenoyPlayerDetailsIcon = () => <Icon fa="fa fa-search" translate tooltip="teamCalendar.frenoyPlayerResults" />;


type FrenoyLinkProps = {
  competition: Competition;
  uniqueIndex: number;
  children: any;
};

export const FrenoyLink = ({competition, uniqueIndex, children}: FrenoyLinkProps) => {
  const frenoyLink = createFrenoyLinkByUniqueId(competition, uniqueIndex);
  if (!frenoyLink) {
    return null;
  }
  return (
    <a
      href={frenoyLink}
      target="_blank"
      rel="noopener noreferrer"
      className="link-hover-underline"
    >
      {children}
      <FrenoyPlayerDetailsIcon />
    </a>
  );
};



type FrenoyButtonProps = {
  team: ITeam;
  linkTo: 'results' | 'ranking';
  className?: string;
}

export class FrenoyButton extends Component<FrenoyButtonProps> {
  render() {
    const {linkTo} = this.props;
    return (
      <a
        href={this.props.team.frenoy.getUrl(linkTo)}
        target="_blank"
        rel="noopener noreferrer"
        className={this.props.className}
        style={{display: 'inline-block'}}
      >
        <button type="button" className={`btn btn-${this.props.team.competition}`}>
          <Icon
            fa={cn('fa fa-2x', {'fa-list-ol': linkTo === 'ranking', 'fa-dashboard': linkTo === 'results'})}
            tooltip={t(`teamCalendar.frenoy${linkTo}`)}
          />
        </button>
      </a>
    );
  }
}



type FrenoyWeekButtonProps = {
  team: ITeam;
  week: number;
  className?: string;
  style?: React.CSSProperties;
}

export class FrenoyWeekButton extends Component<FrenoyWeekButtonProps> {
  render() {
    return (
      <a
        href={this.props.team.frenoy.getWeekUrl(this.props.week)}
        target="_blank"
        rel="noopener noreferrer"
        className={this.props.className}
        style={({display: 'inline-block', ...this.props.style})}
      >
        <button type="button" className={`btn btn-${this.props.team.competition}`}>
          <Icon
            fa="fa fa-2x fa-calendar"
            tooltip={t('teamCalendar.frenoyweek')}
          />
        </button>
      </a>
    );
  }
}



export class FrenoyWeekLink extends Component<{match: IMatch}> {
  render() {
    const {match} = this.props;
    const team = match.getTeam();
    return (
      <a href={team.frenoy.getWeekUrl(match.week)} target="_blank" rel="noopener noreferrer" className="link-hover-underline">
        {match.frenoyMatchId}
      </a>
    );
  }
}
