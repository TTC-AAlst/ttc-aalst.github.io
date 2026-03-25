import React, {Component} from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Placement} from 'react-bootstrap/types';
import t from '../../locales';

type WithTooltipProps = {
  tooltip?: string;
  title?: string;
  translate?: boolean;
  tooltipPlacement?: Placement;
}

export function withTooltip<P extends object>(ComposedComponent: React.ComponentType<P>) {
  return class WithTooltip extends Component<P & WithTooltipProps> {
    static defaultProps = {
      tooltipPlacement: 'top',
    };

    render() {
      const {tooltip, title, translate, tooltipPlacement, ...props} = this.props;

      let realTooltip: string = (tooltip || title || '') as string;
      if (!realTooltip) {
        return <ComposedComponent {...props as P} />;
      }

      const id = realTooltip;
      if (translate) {
        realTooltip = t(realTooltip);
      }

      return (
        <OverlayTrigger placement={tooltipPlacement} overlay={<Tooltip id={id}>{realTooltip}</Tooltip>}>
          <ComposedComponent {...props as P} />
        </OverlayTrigger>
      );
    }
  };
}
