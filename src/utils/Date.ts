import {TTimestampClient} from '../types/Firebase';

export const getSecondsFromTimestamp = (timestamp: TTimestampClient) =>
  new Date(timestamp._seconds * 1000).getTime();

export const getSecondsGap = ({
  start,
  end,
}: {
  start?: TTimestampClient;
  end: TTimestampClient;
}) => {
  const s = start ? getSecondsFromTimestamp(start) : new Date().getTime();
  const diff = s - getSecondsFromTimestamp(end);

  return Math.floor(diff / 1000);
};

export const getTimeGap = (timestamp: TTimestampClient) => {
  const seconds = Math.abs(getSecondsGap({end: timestamp}));

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + 'y';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + 'mo';
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
    return Math.floor(interval) + 'm';
  }
  return Math.floor(seconds) + 's';
};

export const getDate = (timestamp: TTimestampClient) => {
  return new Date(timestamp._seconds * 1000);
};

export const getUTCHour = (hour: number) => {
  const now = new Date();
  now.setHours(hour);
  const utcHour = now.getUTCHours();

  return utcHour;
};

export const getLocalHour = (hour: number) => {
  const now = new Date();
  now.setUTCHours(hour);
  const localHour = now.getHours();

  return localHour;
};

export const getDiffDays = ({
  start,
  end,
}: {
  start: TTimestampClient;
  end?: TTimestampClient;
}) => {
  const startDate = getDate(start);
  const endDate = end ? getDate(end) : new Date();

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime() + 1) / 86400000,
  );

  return days;
};
