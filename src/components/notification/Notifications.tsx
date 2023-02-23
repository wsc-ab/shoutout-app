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
      if (remoteMessage) {
        onUpdate({
          target: remoteMessage.data?.collection!,
          data: {id: remoteMessage.data?.id, path: remoteMessage.data?.path},
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
      console.log('onMessageHandler');

      if (notification) {
        await notifee.displayNotification({
          title: notification.title,
          body: notification.body,
          data: data,
        });
      }
    };
    const unsub = messaging().onMessage(onMessageHandler);
    return () => {
      unsub();
    };
  }, []);

  return null;
};

export default Notifications;
