import {TDocData} from '../types/Firebase';
import {getSecondsGap, getTimeGap} from './Date';

export const getUserAdded = ({
  authUserData,
  room,
}: {
  authUserData: TDocData;
  room: TDocData;
}) => {
  const authUserAddedAt = room.moments.items.filter(
    ({user: {id: elId}}) => elId === authUserData.id,
  )[0]?.addedAt;

  const secondsGap = authUserAddedAt
    ? getSecondsGap({end: authUserAddedAt})
    : undefined;
  const timeGap = authUserAddedAt ? getTimeGap(authUserAddedAt) : undefined;

  const added = secondsGap ? secondsGap - 24 * 60 * 60 < 0 : false;

  return {added, timeGap};
};

export const getNewContents = ({authUserData}: {authUserData: TDocData}) => {
  const viewedAt = authUserData.viewedAt;

  const newContents = [];

  for (const moment of authUserData.contributeTo.items) {
    for (const content of moment.contents) {
      if (!viewedAt) {
        newContents.push(content);
      } else if (getSecondsGap({start: content.addedAt, end: viewedAt}) >= 0) {
        newContents.push(content);
      }
    }
  }

  return newContents;
};
