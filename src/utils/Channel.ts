import {TDocData} from '../types/Firebase';
import {getSecondsGap} from './Date';

export const checkGhosting = ({
  authUser,
  channel,
}: {
  authUser: TDocData;
  channel: TDocData;
}) => {
  // if spam is not set
  // return false
  if (!channel.options.ghosting) {
    return false;
  }

  // if ghosting is off
  // return false
  if (channel.options.ghosting?.mode === 'off') {
    return false;
  }

  // get user last addedAt

  const userLastAddedAt = channel.moments.items.filter(
    ({createdBy: {id: elId}}) => elId === authUser.id,
  )[0]?.addedAt;

  // if user has not added
  // return true

  if (!userLastAddedAt) {
    return true;
  }

  // check if time has passed

  const allowedSeconds =
    parseInt(channel.options.ghosting.mode, 10) * 24 * 60 * 60;

  const secondsSinceLastAddedAt = getSecondsGap({end: userLastAddedAt});

  const ghosting = secondsSinceLastAddedAt > allowedSeconds;

  return ghosting;
};

export const checkSpam = ({
  authUser,
  channel,
}: {
  authUser: TDocData;
  channel: TDocData;
}) => {
  const now = new Date();
  // if spam is not set
  // return false
  if (!channel.options.spam) {
    return {spam: false, nextTime: now};
  }

  // if spam is off
  // return false
  if (channel.options.spam?.mode === 'off') {
    return {spam: false, nextTime: now};
  }

  // get user last addedAt

  const userLastAddedAt = channel.moments.items.filter(
    ({createdBy: {id: elId}}) => elId === authUser.id,
  )[0]?.addedAt;

  // if user has not added
  // return false

  if (!userLastAddedAt) {
    return {spam: false, nextTime: now};
  }

  // check if spam has passed

  const allowedSeconds = parseInt(channel.options.spam, 10) * 60 * 60;

  const secondsSinceLastAddedAt = getSecondsGap({end: userLastAddedAt});

  const spam = secondsSinceLastAddedAt < allowedSeconds;
  const waitSec = Math.max(allowedSeconds - secondsSinceLastAddedAt, 0);

  const nextTime = new Date(now.getTime() + waitSec * 1000);

  return {
    spam,
    nextTime,
  };
};
