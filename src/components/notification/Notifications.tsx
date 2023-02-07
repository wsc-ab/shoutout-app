import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {defaultBlack} from '../defaults/DefaultColors';

import Popup from './Popup';

type TProps = {isPermitted: boolean};

const Notifications = ({isPermitted}: TProps) => {
  const [notifications, setNotifications] = useState<
    {title: string; body: string; collection?: string; id?: string}[]
  >([
    {title: '1', body: '1', collection: 'users', id: 'id'},
    {title: '2', body: '1', collection: 'users', id: 'id'},
    {title: '3', body: '1', collection: 'users', id: 'id'},
  ]);

  const displaySeconds = 10;

  // listen to push noficiations
  useEffect(() => {
    const alertNotification = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      if (
        remoteMessage.notification &&
        remoteMessage.notification?.title &&
        remoteMessage.notification?.body
      ) {
        const title = remoteMessage.notification?.title;

        const body = remoteMessage.notification?.body;

        setNotifications(pre => {
          const copyPre = [...pre];
          return [
            ...copyPre,
            {
              title,
              body,
              collection: remoteMessage.data?.collection!,
              id: remoteMessage.data?.id!,
            },
          ];
        });
      }
    };

    if (isPermitted) {
      // handle notification in app
      const unsubscribe = messaging().onMessage(message => {
        alertNotification(message);
      });

      // handle notification to open app
      messaging().onNotificationOpenedApp(message => {
        message.data;
      });

      // handle notification from killed app
      messaging()
        .getInitialNotification()
        .then(message => {
          if (message) {
            message.data;
          }
        });

      return unsubscribe;
    }
  }, [isPermitted]);

  const [, setSeconds] = useState(3);

  useEffect(() => {
    if (notifications.length >= 1) {
      const interval = setInterval(() => {
        setSeconds(pre => {
          if (pre === 0) {
            setNotifications(preNoti => {
              const copyPre = [...preNoti];
              copyPre.shift();
              return copyPre;
            });
            return displaySeconds;
          } else {
            return pre - 1;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [notifications.length]);

  if (!notifications[0]) {
    return null;
  }

  const onCancel = () => {
    setNotifications(preNoti => {
      const copyPre = [...preNoti];
      copyPre.shift();

      return copyPre;
    });
    setSeconds(displaySeconds);
  };

  const onPressPopup = (collection: string, id: string) => {};

  return (
    <View style={{position: 'absolute', left: 0, right: 0, top: 100}}>
      <Popup
        style={styles.popup}
        notification={notifications[0]}
        onCancel={onCancel}
        onPress={() =>
          onPressPopup(notifications[0].collection, notifications[0].id)
        }
      />
      {notifications[1] && (
        <Popup
          style={{...styles.nextPopup}}
          notification={notifications[1]}
          onCancel={onCancel}
        />
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  popup: {
    padding: 20,
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 10,
    flexDirection: 'row',
    zIndex: 100,
    elevation: 3,
    shadowOpacity: 0.5,
  },
  nextPopup: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderRadius: 10,
    backgroundColor: defaultBlack.lv3(1),
    flexDirection: 'row',
    zIndex: 1,
    margin: 15,
    elevation: 3,
    shadowOpacity: 0.5,
  },
});
