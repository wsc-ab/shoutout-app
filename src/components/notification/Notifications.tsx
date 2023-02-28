import notifee, {EventDetail, EventType} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useCallback, useContext, useEffect} from 'react';
import ModalContext from '../../contexts/Modal';
import PopupContext from '../../contexts/Popup';

type TProps = {isPermitted: boolean};

const Notifications = ({isPermitted}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {addPopup} = useContext(PopupContext);

  const openModal = useCallback(
    (remoteMessage: EventDetail['notification']) => {
      if (remoteMessage?.data?.collection === 'moments') {
        onUpdate({
          target: 'moments',
          data: {
            moments: [{id: remoteMessage?.data?.id}],
            contentPath: remoteMessage?.data?.path,
          },
        });
      } else if (remoteMessage?.data?.collection === 'rooms') {
        return;
      } else if (remoteMessage?.data?.collection) {
        onUpdate({
          target: remoteMessage?.data?.collection.slice(0, -1),
          data: {
            id: remoteMessage?.data?.id,
            contentPath: remoteMessage?.data?.path,
          },
        });
      }
    },
    [onUpdate],
  );
  useEffect(() => {
    if (isPermitted) {
      const unsub = notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            openModal(detail.notification);
            break;
        }
      });
      return unsub;
    }
  }, [isPermitted, openModal]);

  useEffect(() => {
    const onMessageHandler = async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const {notification, data} = remoteMessage;

      if (notification) {
        if (data.collection === 'moments') {
          addPopup({
            title: notification.title,
            body: notification.body,
            target: 'moments',
            image: data.fcm_options.image,
            data: {
              moments: [{id: data.id}],
              contentPath: data.path as string | undefined,
            },
          });
        } else if (data.collection) {
          addPopup({
            title: notification.title,
            body: notification.body,
            target: (data.collection as string).slice(0, -1),
            image: data.fcm_options.image,
            data: {
              id: data.id as string | undefined,
              path: data.path as string | undefined,
            },
          });
        }
      }
    };
    const unsubscribe = messaging().onMessage(onMessageHandler);
    return unsubscribe;
  }, [addPopup]);

  return null;
};

export default Notifications;
