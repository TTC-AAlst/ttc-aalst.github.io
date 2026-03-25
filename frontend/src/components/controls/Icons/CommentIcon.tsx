import React from 'react';
import {Icon, IconProps} from './Icon';

export const CommentIcon = (props: Omit<IconProps, 'fa'> & {tooltip?: string}) => (
  <Icon fa="fa fa-comment-o" {...props} />
);
