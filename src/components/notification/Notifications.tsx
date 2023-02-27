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
      if (remoteMessage?.data?.collection) {
        onUpdate({
          target: (remoteMessage.data.collection as string).slice(0, -1),
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
        addPopup({
          title: notification.title,
          body: notification.body,
          target: (data.collection as string).slice(0, -1),
          image: data.image,
          data: {
            id: data.id as string | undefined,
            path: data.path as string | undefined,
          },
        });
      }
    };
    const unsubscribe = messaging().onMessage(onMessageHandler);
    return unsubscribe;
  }, [addPopup]);

  return null;
};

export default Notifications;
