import notifee, {EventDetail, EventType} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useCallback, useContext, useEffect} from 'react';
import ModalContext from '../../contexts/Modal';

type TProps = {isPermitted: boolean};

const Notifications = ({isPermitted}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  const openModal = useCallback(
    (remoteMessage: EventDetail['notification']) => {
      if (remoteMessage?.data?.collection) {
        onUpdate({
          target: remoteMessage.data.collection as string,
          data: {
            id: remoteMessage.data.id as string | undefined,
            path: remoteMessage.data.path as string | undefined,
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
        await notifee.createChannel({
          id: 'sound',
          name: 'Channel with sound',
          sound: 'default',
        });

        await notifee.displayNotification({
          title: notification.title,
          body: notification.body,
          data: data,
          android: {channelId: 'sound'},
          ios: {
            sound: 'default',
          },
        });
      }
    };
    const unsubscribe = messaging().onMessage(onMessageHandler);
    return unsubscribe;
  }, []);

  return null;
};

export default Notifications;
