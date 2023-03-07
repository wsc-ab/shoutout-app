import {TDocData} from '../types/Firebase';
import {getSecondsGap, getTimeGap} from './Date';

export const getUserAdded = ({
  authUserData,
  channel,
}: {
  authUserData: TDocData;
  channel: TDocData;
}) => {
  const authUserAddedAt = channel.moments.items.filter(
    ({user: {id: elId}}) => elId === authUserData.id,
  )[0]?.addedAt;

  const secondsGap = authUserAddedAt
    ? getSecondsGap({end: authUserAddedAt})
    : undefined;
  const timeGap = authUserAddedAt ? getTimeGap(authUserAddedAt) : undefined;

  const added = secondsGap ? secondsGap - 24 * 60 * 60 < 0 : false;

  return {added, timeGap};
};

export const getNewMoments = ({authUserData}: {authUserData: TDocData}) => {
  const viewedAt = authUserData.viewedAt;

  const newMoments = [];

  for (const moment of authUserData.contributeTo.items) {
    if (!viewedAt) {
      newMoments.push(moment);
    } else if (getSecondsGap({start: moment.addedAt, end: viewedAt}) >= 0) {
      newMoments.push(moment);
    }
  }

  return newMoments;
};
