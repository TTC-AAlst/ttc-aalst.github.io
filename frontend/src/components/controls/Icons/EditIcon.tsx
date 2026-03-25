import React from 'react';
import { Placement } from 'react-bootstrap/types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Icon, IconProps } from './Icon';

type EditIconProps = Omit<IconProps, 'fa'> & {
  tooltip?: string;
  tooltipPlacement?: Placement;
}

export const EditIcon = ({tooltip, tooltipPlacement, ...props}: EditIconProps) => {
  const icon = <Icon fa="fa fa-pencil-square-o" {...props} />;

  if (tooltip) {
    return (
      <OverlayTrigger placement={tooltipPlacement} overlay={<Tooltip id={tooltip}>{tooltip}</Tooltip>}>
        {icon}
      </OverlayTrigger>
    );
  }
  return icon;
};
