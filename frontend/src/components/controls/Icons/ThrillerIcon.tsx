import React from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Icon } from './Icon';
import { t } from '../../../locales';

export const ThrillerIcon = ({ color = undefined }: { color?: string }) => (
  <Icon fa="fa fa-heartbeat faa-pulse animated" style={{ marginLeft: 3, marginRight: 7, marginTop: 3, color }} translate tooltip="match.thrillerMatch" />
);

type BadgyProps = {
  type: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  tooltip?: string;
};

export const Badgy = ({ type, style, children, tooltip }: BadgyProps) => (
  <OverlayTrigger placement="top" overlay={<Tooltip id={tooltip}>{t(tooltip)}</Tooltip>}>
    <span className={`badge label-as-badge ${type}`} style={style}>
      {children}
    </span>
  </OverlayTrigger>
);
