import React, { useState } from 'react';
import cn from 'classnames';
import { Icon } from '../Icons/Icon';
import { IconButtonComponentProps } from './Button';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';

type ExcelButtonComponentProps = Omit<IconButtonComponentProps, 'onClick' | 'fa'> & {
  tooltip?: string;
  onClick: () => Promise<void>;
}

export const ExcelButton = (props: ExcelButtonComponentProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const user = useTtcSelector(selectUser);

  const onDownload = () => {
    if (isDownloading) {
      return;
    }
    setIsDownloading(true);

    props.onClick()
      .catch(err => {
        console.error('err', err);  
      })
      .then(() => setIsDownloading(false));
  };

  if (!user.playerId) {
    return <div />;
  }
  return (
    <button type="button" onClick={() => onDownload()} className={cn('btn ', props.className)} style={props.style}>
      <Icon
        fa={cn('fa-2x', isDownloading ? 'fa fa-spinner fa-pulse' : 'fa fa-file-excel-o')}
        tooltip={props.tooltip}
      />
    </button>
  );
};
