/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import notifee from '@notifee/react-native';
import {
  firebase,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Home from './src/components/screen/Home';
import {AuthUserProvider} from './src/contexts/AuthUser';
import {CacheProvider} from './src/contexts/Cache';
import {ModalProvider} from './src/contexts/Modal';
import {UploadingProvider} from './src/contexts/Uploading';
import {TBundleId} from './src/types/Data';
import {TStatus} from './src/types/Screen';
import {initAlgolia} from './src/utils/Algolia';
import {initFirebase} from './src/utils/Firebase';
import './src/utils/FontAwesome';

// Your app's background handler for incoming remote messages
firebase
  .messaging()
  .setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('called');

      const {notification, data} = remoteMessage;
      if (notification) {
        await notifee.displayNotification({
          title: notification.title,
          body: notification.body,
          data: data,
        });
      }
      // Increment the count by 1
      await notifee.incrementBadgeCount();
    },
  );

type TProps = {
  bundleId: TBundleId;
};

const App = ({bundleId}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      initFirebase();
      initAlgolia(bundleId);

      setStatus('loaded');
    };

    if (status === 'loading') {
      load();
    }
  }, [bundleId, status]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CacheProvider>
        <AuthUserProvider bundleId={bundleId}>
          <UploadingProvider>
            <ModalProvider>
              <Home />
            </ModalProvider>
          </UploadingProvider>
        </AuthUserProvider>
      </CacheProvider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
});
