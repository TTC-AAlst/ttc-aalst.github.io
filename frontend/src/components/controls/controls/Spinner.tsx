import React from 'react';
import BSSpinner from 'react-bootstrap/Spinner';
import { Icon } from '../Icons/Icon';

type SpinnerProps = {
  size?: number;
};

export const Spinner = ({ size = 1 }: SpinnerProps) => (
  <div>
    <Icon fa={`fa fa-spinner fa-pulse fa-${size}x`} />
  </div>
);

export const FullScreenSpinner = () => (
  <div style={{ width: 210, margin: 'auto', paddingTop: 75 }}>
    <BSSpinner animation="border" variant="secondary" style={{ width: 200, height: 200 }} />
  </div>
);
