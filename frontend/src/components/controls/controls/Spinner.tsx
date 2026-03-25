import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {Icon} from '../Icons/Icon';

type SpinnerProps = {
  size?: number;
}

export const Spinner = ({size = 1}: SpinnerProps) => (
  <div>
    <Icon fa={`fa fa-spinner fa-pulse fa-${size}x`} />
  </div>
);


export const FullScreenSpinner = () => (
  <div style={{width: 210, margin: 'auto', paddingTop: 75}}><CircularProgress color="secondary" size={200} /></div>
);
