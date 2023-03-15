import notifee, {EventDetail, EventType} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useCallback, useContext, useEffect} from 'react';
import ModalContext from '../../contexts/Modal';
import PopupContext from '../../contexts/Popup';
import {TObject} from '../../types/Firebase';

type TProps = {isPermitted: boolean};

const Notifications = ({isPermitted}: TProps) => {
  const {addPopup} = useContext(PopupContext);
  const {onUpdate} = useContext(ModalContext);

  const openModal = useCallback(
    (remoteMessage: EventDetail['notification']) => {
      const id = remoteMessage?.data?.id as string | undefined;
      const collection = remoteMessage?.data?.collection as string | undefined;
      switch (collection) {
        case 'users':
          if (id) {
            onUpdate({target: 'user', data: {user: {id}}});
          }
          break;

        case 'channels':
          const momentId = remoteMessage?.data?.momentId as string | undefined;
          if (id) {
            onUpdate({
              target: 'channelId',
              data: {channel: {id}, moment: {id: momentId}},
            });
          }
          break;

        default:
          break;
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
      const notification = remoteMessage?.notification as TObject | undefined;
      const messageData = remoteMessage?.data as TObject | undefined;

      if (!(notification && messageData)) {
        return;
      }

      let popup;

      switch (messageData.collection) {
        case 'channels':
          popup = {
            title: notification.title,
            body: notification.body,
            target: 'channelId',
            image: messageData.fcm_options.image,
            data: {
              channel: {
                id: messageData.id,
              },
              momentId: messageData.momentId,
            },
          };
          break;

        case 'users':
          popup = {
            title: notification.title,
            body: notification.body,
            target: 'user',
            image: messageData.fcm_options.image,
            data: {
              user: {
                id: messageData.id,
              },
            },
          };
          break;

        default:
          break;
      }

      if (popup) {
        addPopup(popup);
      }
    };
    const unsubscribe = messaging().onMessage(onMessageHandler);
    return unsubscribe;
  }, [addPopup]);

  return null;
};

export default Notifications;
