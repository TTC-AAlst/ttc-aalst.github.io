import React from 'react';
import {EditIcon} from '../Icons/EditIcon';
import {IconButtonComponentProps} from './Button';

type EditButtonProps = Omit<IconButtonComponentProps, 'fa'> & {title?: string, fa?: string};

export const EditButton = ({onClick, title, style, fa}: EditButtonProps) => (
  <button type="button" className="btn btn-outline-secondary" onClick={onClick} title={title} style={style}>
    <EditIcon className={fa} />
  </button>
);
