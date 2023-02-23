import notifee, {EventType} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useEffect} from 'react';

type TProps = {isPermitted: boolean};
const Notifications = ({isPermitted}: TProps) => {
  useEffect(() => {
    if (isPermitted) {
      const unsub = notifee.onForegroundEvent(({type}) => {
        switch (type) {
          case EventType.PRESS:
            console.log('Notification clicked by user');
            break;
        }
      });
      return unsub;
    }
  }, [isPermitted]);

  useEffect(() => {
    const onMessageHandler = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const {notification, data} = remoteMessage;

      console.log(notification, data);

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
          console.log('getInitialNotification');
        }
      });
    }
  }, [isPermitted]);

  return null;
};

export default Notifications;
