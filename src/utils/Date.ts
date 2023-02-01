import {TTimestamp, TTimestampClient} from '../types/Firebase';

export const getSecondsFromTimestamp = (timestamp: TTimestampClient) =>
  new Date(timestamp._seconds * 1000).getTime();

export const getSecondsBeforeNow = (timestamp: TTimestampClient) =>
  Math.floor(
    (new Date().getTime() - getSecondsFromTimestamp(timestamp)) / 1000,
  );

const getTimeGap = (timestamp: TTimestampClient) => {
  const seconds = getSecondsBeforeNow(timestamp);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + 'y';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + 'm';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + 'd';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'h';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'min';
  }
  return Math.floor(seconds) + 's';
};

export const getTimeSinceTimestamp = (timestamp: TTimestamp) => {
  const timeGap = getTimeGap(timestamp as unknown as TTimestampClient);

  return timeGap + ' ago';
};

export const getDate = (timestamp: TTimestampClient) => {
  return new Date(timestamp._seconds * 1000);
};

export const getSecondsGap = ({
  date,
  timestamp,
}: {
  date: Date;
  timestamp: TTimestampClient;
}) => Math.floor((date.getTime() - getSecondsFromTimestamp(timestamp)) / 1000);
