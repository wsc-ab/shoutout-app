import notifee, {EventDetail, EventType} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {signIn} from '../functions/User';
import {TObject} from '../types/Firebase';
import AuthUserContext from './AuthUser';
import PopupContext from './Popup';

type TContextProps = {
  notification?: EventDetail['notification'];
  onReset: () => void;
};

const NotificationContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const NotificationProvider = ({children}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [isChecked, setIsChecked] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);
  const [notification, setNotification] =
    useState<EventDetail['notification']>();
  const {addPopup} = useContext(PopupContext);

  // check and request notification permission
  useEffect(() => {
    let isMounted = true;
    const checkPermission = async () => {
      const getPermission = async () => {
        // On Android, you do not need to request user permission.
        // This method can still be called on Android devices; however, and will always resolve successfully.
        const authStatus = await messaging().requestPermission();

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        setIsPermitted(enabled);

        if (enabled) {
          try {
            const newToken = await messaging().getToken();

            if (authUserData?.token !== newToken) {
              await signIn({user: {token: newToken, id: authUserData.id}});
            }
          } catch {}
        }
      };
      await getPermission();

      if (isMounted) {
        setIsChecked(true);
      }
    };

    if (authUserData && !isChecked) {
      checkPermission();
    }

    return () => {
      isMounted = false;
    };
  }, [authUserData, isChecked]);

  useEffect(() => {
    if (isPermitted) {
      const unsub = notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            setNotification(detail.notification);

            break;
        }
      });
      return unsub;
    }
  }, [isPermitted]);

  useEffect(() => {
    const onMessageHandler = async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const newNotification = remoteMessage?.notification as
        | TObject
        | undefined;
      const messageData = remoteMessage?.data as TObject | undefined;

      if (!(newNotification && messageData)) {
        return;
      }

      let popup;

      switch (messageData.collection) {
        case 'channels':
          popup = {
            title: newNotification.title,
            body: newNotification.body,
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
            title: newNotification.title,
            body: newNotification.body,
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

  const onReset = () => setNotification(undefined);

  return (
    <NotificationContext.Provider value={{notification, onReset}}>
      {children}
    </NotificationContext.Provider>
  );
};

export {NotificationProvider};
export default NotificationContext;
