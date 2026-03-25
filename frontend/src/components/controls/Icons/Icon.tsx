import React, { MouseEventHandler } from 'react';
import cn from 'classnames';
import { withTooltip } from '../../../utils/decorators/withTooltip';

export type IconProps = {
  fa: string;
  color?: string | undefined;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLElement> | undefined;
  className?: string;
};

const IconComponent = ({ fa, color, style, onClick, className, ...props }: IconProps) => {
  if (!onClick) {
    return <i {...props} className={cn(fa, className, { clickable: !!onClick })} style={{ color, ...style }} />;
  }
  return <i {...props} className={cn(fa, className, { clickable: !!onClick })} onClick={onClick} style={{ color, ...style }} role="button" tabIndex={0} />;
};

export const Icon = withTooltip(IconComponent);
