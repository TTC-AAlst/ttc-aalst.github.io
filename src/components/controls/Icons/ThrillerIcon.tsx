import React, {Component} from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Icon} from './Icon';
import {IMatch} from '../../../models/model-interfaces';
import { t } from '../../../locales';

export const ThrillerIcon = ({color = undefined}: {color?: string}) => (
  <Icon
    fa="fa fa-heartbeat faa-pulse animated"
    style={{marginLeft: 3, marginRight: 7, marginTop: 3, color}}
    translate
    tooltip="match.thrillerMatch"
  />
);


export type BadgyProps = {
  type: string,
  style?: React.CSSProperties,
  children?: any,
  tooltip?: string,
}


// Badgy because material-ui also defines a Badge
export class Badgy extends Component<BadgyProps> {
  render() {
    const {type, style, children, tooltip} = this.props;

    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id={tooltip}>{t(tooltip)}</Tooltip>}>
        <span className={`badge label-as-badge ${type}`} style={style}>
          {children}
        </span>
      </OverlayTrigger>
    );
  }
}




export const ThrillerBadge = ({match}: {match: IMatch}) => {
  const team = match.getTeam();
  const thrillerType = team.getThriller(match);
  if (thrillerType) {
    return (
      <span className="badge label-as-badge bg-danger">
        <ThrillerIcon />
        {t(`match.${thrillerType}`)}
      </span>
    );
  }
  return null;
};
