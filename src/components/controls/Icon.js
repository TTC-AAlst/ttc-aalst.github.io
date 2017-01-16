import React, { PropTypes, Component } from 'react';
import cn from 'classnames';

export class Icon extends Component {
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

// Badgy because material-ui also defines a Badge
export const Badgy = ({type, children, style, tooltip}) => (
  <span className={'label label-as-badge ' + type} style={style} title={tooltip}>
    {children}
  </span>
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

export class DownloadExcelIcon extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {isDownloading: false}
  }

  _onClick() {
    if (this.state.isDownloading) {
      return;
    }

    this.setState({isDownloading: true});

    this.props.onClick()
      .catch(err => {
        console.error('err', err);
      })
      .then(() => this.setState({isDownloading: false}));
  }

  render() {
    return (
      <a
        onClick={() => this._onClick()}
        title={this.props.title}
        className={cn('clickable', this.props.className)}
        style={this.props.style}
      >
        <Icon fa={this.state.isDownloading ? 'fa fa-spinner fa-pulse fa-2x' : 'fa fa-file-excel-o fa-2x'} />
      </a>
    );
  }
}
