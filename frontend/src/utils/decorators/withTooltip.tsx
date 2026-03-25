import React from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Placement } from 'react-bootstrap/types';
import t from '../../locales';

type WithTooltipProps = {
  tooltip?: string;
  title?: string;
  translate?: boolean;
  tooltipPlacement?: Placement;
};

export function withTooltip<P extends object>(ComposedComponent: React.ComponentType<P>) {
  const WithTooltip = ({ tooltip, title, translate, tooltipPlacement = 'top', ...props }: P & WithTooltipProps) => {
    let realTooltip: string = (tooltip || title || '') as string;
    if (!realTooltip) {
      return <ComposedComponent {...(props as P)} />;
    }

    const id = realTooltip;
    if (translate) {
      realTooltip = t(realTooltip);
    }

    return (
      <OverlayTrigger placement={tooltipPlacement} overlay={<Tooltip id={id}>{realTooltip}</Tooltip>}>
        <ComposedComponent {...(props as P)} />
      </OverlayTrigger>
    );
  };

  WithTooltip.displayName = `WithTooltip(${ComposedComponent.displayName || ComposedComponent.name || 'Component'})`;
  return WithTooltip;
}
