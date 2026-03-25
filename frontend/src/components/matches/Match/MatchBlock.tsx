import React from 'react';
import { Icon } from '../../controls/Icons/Icon';

type MatchBlockProps = {
  block: string;
  displayNonBlocked: boolean;
}

export const MatchBlock = ({block, displayNonBlocked}: MatchBlockProps) => {
  if (block === 'Captain') {
    return <CaptainIcon />;
  }
  if (block === 'Major') {
    return <MajorIcon />;
  }

  if (!displayNonBlocked) {
    return null;
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
    style={{color: '#ffc107'}}
    translate
    tooltip="match.block.Captain"
  />
);

const MajorIcon = () => (
  <Icon
    fa="fa fa-2x fa-angle-double-up"
    style={{color: '#198754'}}
    translate
    tooltip="match.block.Major"
  />
);
