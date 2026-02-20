import React, { useEffect, useState } from 'react';
import moment from 'moment';

interface TimeAgoProps {
  date: Date | string | number;
}

const interval = 60_000; // 1min

export const TimeAgo = ({ date }: TimeAgoProps) => {
  const [_, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), interval);
    return () => clearInterval(timer);
  }, []);

  if (!date) {
    return null;
  }

  return <span>{moment(date).fromNow()}</span>;
};
