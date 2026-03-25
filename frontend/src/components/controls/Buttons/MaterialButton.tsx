import React from 'react';
import Button from 'react-bootstrap/Button';

type MaterialButtonProps = {
  label: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;

  style?: React.CSSProperties;
  variant?: 'text' | 'outlined' | 'contained';
};

const colorMap: Record<string, string> = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

export class MaterialButton extends React.Component<MaterialButtonProps> {
  render() {
    const { label, color = 'primary', variant, style, ...rest } = this.props;
    let bsVariant = colorMap[color] || 'primary';
    if (variant === 'outlined') {
      bsVariant = `outline-${bsVariant}`;
    } else if (variant === 'text' || (!variant && color !== 'primary')) {
      bsVariant = `outline-${bsVariant}`;
    }
    return (
      <Button variant={bsVariant as never} style={style} {...rest}>
        {label}
      </Button>
    );
  }
}
