import React from 'react';
import {ThumbsUpIcon, ThumbsDownIcon} from '../Icons/ThumbsIcons';

export const WonLostLabel = ({won, lost}: {won: number, lost: number}) => (
  <div>
    <ThumbsUpIcon style={{marginLeft: 10}} />
    {won}

    {lost ? <ThumbsDownIcon style={{marginLeft: 8}} /> : null}
    {lost || ''}
  </div>
);
