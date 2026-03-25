import React from 'react';

type StrikeProps = {
  text: string;
  /** Styling on the text (inner span) */
  textStyle?: React.CSSProperties;
  /** Styling on the container (outer div) */
  style?: React.CSSProperties;
}

export const Strike = ({text, textStyle, ...props}: StrikeProps) => (
  <div className="strike" {...props}><span style={{color: 'black', ...textStyle}}>{text}</span></div>
);
