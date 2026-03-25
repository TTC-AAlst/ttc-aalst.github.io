import React from 'react';

export type ButtonComponentProps = {
  onClick: () => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

export type IconButtonComponentProps = {
  onClick: () => void;
  fa: string;
  className?: string;
  style?: React.CSSProperties;
};
