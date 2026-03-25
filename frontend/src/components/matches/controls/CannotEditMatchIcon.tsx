import React from 'react';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {Icon} from '../../controls/Icons/Icon';

export const CannotEditMatchIcon = () => (
  <span className="fa-stack fa-sm pull-right" style={{marginRight: 8, marginTop: 5}}>
    <EditIcon className="fa-stack-1x" />
    <Icon fa="fa fa-ban fa-stack-2x text-danger" />
  </span>
);
