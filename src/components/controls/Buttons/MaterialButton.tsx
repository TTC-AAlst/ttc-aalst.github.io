import React from 'react';
import Button from '@mui/material/Button';

// This transforms the material-ui Button from v0.x to the new API

type MaterialButtonProps = {
  label: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: React.MouseEventHandler<any>;
  disabled?: boolean;

  style?: React.CSSProperties;
  variant?: 'text' | 'outlined' | 'contained';
}

export class MaterialButton extends React.Component<MaterialButtonProps> {
  render() {
    const {label, ...props} = this.props;
    return (
      <Button {...props}>
        {label}
      </Button>
    );
  }
}
