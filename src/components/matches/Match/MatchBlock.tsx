import React from 'react';
import { Icon } from '../../controls/Icons/Icon';

export const MatchBlock = ({block}: {block: string}) => {
  if (block === 'Captain') {
    return <CaptainIcon />;
  }
  if (block === 'Major') {
    return <MajorIcon />;
  }

  return <NotPublishedIcon />;
};

const NotPublishedIcon = () => (
  <Icon
    fa="fa fa-eye-slash"
    style={{color: ''}}
    translate
    tooltip="match.block.None"
  />
);

const CaptainIcon = () => (
  <Icon
    fa="fa fa-star"
    style={{color: '#C0C0C0'}}
    translate
    tooltip="match.block.Captain"
  />
);

const MajorIcon = () => (
  <Icon
    fa="fa fa-2x fa-angle-double-up"
    style={{color: '#ffaf0f'}}
    translate
    tooltip="match.block.Major"
  />
);
