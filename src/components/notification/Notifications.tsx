import notifee, {EventType} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useCallback, useContext, useEffect} from 'react';
import ModalContext from '../../contexts/Modal';

type TProps = {isPermitted: boolean};

const Notifications = ({isPermitted}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  const openModal = useCallback(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      onUpdate({
        target: remoteMessage.data?.collection!,
        data: {id: remoteMessage.data?.id, path: remoteMessage.data?.path},
      });
    },
    [onUpdate],
  );
  useEffect(() => {
    if (isPermitted) {
      const unsub = notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            console.log(detail.notification, 'detail.notification');

            openModal(detail.notification);
            break;
        }
      });
      return unsub;
    }
  }, [isPermitted, openModal]);

  useEffect(() => {
    const onMessageHandler = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const {notification, data} = remoteMessage;

      if (notification) {
        notifee.displayNotification({
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

  useEffect(() => {
    if (isPermitted) {
      notifee.getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          console.log('getInitialNotification called', remoteMessage);

          openModal(remoteMessage.notification);
        }
      });
    }
  }, [isPermitted, openModal]);

  return null;
};

export default Notifications;
