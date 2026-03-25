import React from 'react';
import cn from 'classnames';
import { Icon } from '../Icons/Icon';
import { withTooltip } from '../../../utils/decorators/withTooltip';

export type ButtonComponentProps = {
  onClick: () => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

const ButtonComponent = React.forwardRef<HTMLAnchorElement, ButtonComponentProps>(({ onClick, label, className, style }, ref) => (
  <a ref={ref} onClick={onClick} className={cn(className, 'btn btn-outline-secondary')} style={style} role="button" tabIndex={0}>
    {label}
  </a>
));
ButtonComponent.displayName = 'ButtonComponent';

export const Button = withTooltip(ButtonComponent);

export type IconButtonComponentProps = {
  onClick: () => void;
  fa: string;
  className?: string;
  style?: React.CSSProperties;
};

const IconButtonComponent = React.forwardRef<HTMLAnchorElement, IconButtonComponentProps>(({ onClick, fa, className, style }, ref) => (
  <a ref={ref} onClick={onClick} className={cn(className, 'btn btn-outline-secondary')} style={style} role="button" tabIndex={0}>
    <Icon fa={fa} />
  </a>
));
IconButtonComponent.displayName = 'IconButtonComponent';

export const IconButton = withTooltip(IconButtonComponent);
