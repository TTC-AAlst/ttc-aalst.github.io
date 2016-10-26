import React, { PropTypes, Component } from 'react';
import cn from 'classnames';

export default class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const {fa, color, style, onClick, className, ...props} = this.props;
    return (
      <i
        {...props}
        className={cn(fa, className, {
          clickable: !!onClick,
        })}
        onClick={onClick}
        style={{color: color, ...style}}></i>
    );
  }
}

export const TrophyIcon = ({style, color}) => (
  <Icon fa="fa fa-trophy" color={color || '#FCB514'} style={style} />
);

export const ThrillerIcon = ({color = undefined}) => (
  <Icon fa="fa fa-heartbeat faa-pulse animated" style={{marginLeft: 3, marginRight: 7, marginTop: 3, color: color}} />
);

export const ThrillerBadge = ({t, match}) => {
  const team = match.getTeam();
  const thrillerType = team.getThriller(match);
  if (thrillerType) {
    const thrillerStyle = {
      position: 'absolute',
      top: 60,
      left: 15,
      fontSize: 16,
      paddingRight: 13,
    };
    return (
      <span className="label label-as-badge label-danger" style={thrillerStyle}>
        <ThrillerIcon />
        {t('match.' + thrillerType)}
      </span>
    );
  }
  return <div />;
};