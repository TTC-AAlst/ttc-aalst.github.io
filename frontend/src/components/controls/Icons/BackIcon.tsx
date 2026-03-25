import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, IconProps } from './Icon';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';

export const BackIcon = (props: Omit<IconProps, 'fa'>) => {
  const viewport = useViewport();
  const navigate = useNavigate();
  return (
    <Icon
      fa={`fa fa-times-circle ${viewport.width > 400 ? 'fa-3x' : 'fa-2x'}`}
      color="red"
      onClick={() => navigate(-1)}
      tooltip={t('common.close')}
      tooltipPlacement="left"
      {...props}
    />
  );
};
