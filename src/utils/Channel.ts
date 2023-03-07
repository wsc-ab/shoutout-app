import {TDocData} from '../types/Firebase';
import {getSecondsGap} from './Date';

export const checkLurking = ({
  authUser,
  channel,
}: {
  authUser: TDocData;
  channel: TDocData;
}) => {
  // if lurking is not set
  // return false
  if (!channel.options.lurking) {
    return false;
  }

  // if lurking is off
  // return false
  if (channel.options.lurking?.mode === 'off') {
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
    parseInt(channel.options.lurking.mode, 10) * 24 * 60 * 60;

  const secondsSinceLastAddedAt = getSecondsGap({end: userLastAddedAt});

  const lurking = secondsSinceLastAddedAt > allowedSeconds;

  return lurking;
};
