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
  timestamp,
  date,
}: {
  timestamp: TTimestampClient;
  date: Date;
}) => Math.floor((date.getTime() - getSecondsFromTimestamp(timestamp)) / 1000);

export const getNextSubmitDate = () => {
  const now = new Date();

  const submitDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );

  submitDate.setDate(submitDate.getUTCDate() + 1);
  submitDate.setUTCHours(23, 59, 59, 999);

  return submitDate;
};

export const getSubmitDate = () => {
  const now = new Date();

  const submitDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );

  submitDate.setUTCDate(submitDate.getUTCDate());
  submitDate.setUTCHours(23, 59, 59, 999);

  return submitDate;
};

export const getStartDate = () => {
  const now = new Date();

  const submitDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );

  submitDate.setUTCDate(submitDate.getUTCDate() + 1);
  submitDate.setUTCHours(0, 0, 0, 0);

  return submitDate;
};

export const getCurrentDate = () => {
  const now = new Date();

  const submitDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );

  submitDate.setUTCHours(0, 0, 0, 0);

  return submitDate;
};
