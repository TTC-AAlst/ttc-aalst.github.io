import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {Icon} from '../Icons/Icon';
import {ButtonComponentProps} from './Button';

export const EmailButton = ({tooltip, ...props}: Omit<ButtonComponentProps, 'label'> & {tooltip?: string}) => {
  if (!tooltip) {
    return (
      <Button {...props}>
        <Icon fa="fa fa-envelope-o" />
      </Button>
    );
  }

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id={tooltip}>{tooltip}</Tooltip>}>
      <Button variant="outline-secondary" {...props}>
        <Icon fa="fa fa-envelope-o" />
      </Button>
    </OverlayTrigger>
  );
};
