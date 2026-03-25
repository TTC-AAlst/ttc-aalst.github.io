import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

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

  return <span>{dayjs(date).fromNow()}</span>;
};
