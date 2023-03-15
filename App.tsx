/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Permission from './src/components/notification/Permission';
import Home from './src/components/screen/Home';
import {AuthUserProvider} from './src/contexts/AuthUser';
import {CacheProvider} from './src/contexts/Cache';
import {LanguageProvider} from './src/contexts/Language';
import {ModalProvider} from './src/contexts/Modal';
import {PopupProvider} from './src/contexts/Popup';
import {ServerProvider} from './src/contexts/Server';
import {TBundleId} from './src/types/Data';
import {TStatus} from './src/types/Screen';
import {initAlgolia} from './src/utils/Algolia';
import {initFirebase} from './src/utils/Firebase';

import './src/utils/FontAwesome';

type TProps = {
  bundleId: TBundleId;
};

const App = ({bundleId}: TProps) => {
  // const useEmulator = process.env.NODE_ENV !== 'production';
  const useEmulator = false;
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = () => {
      initFirebase(useEmulator);
      initAlgolia(bundleId);
      setStatus('loaded');
    };

    if (status === 'loading') {
      load();
    }
  }, [bundleId, status, useEmulator]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CacheProvider>
        <LanguageProvider>
          <ServerProvider useEmulator={useEmulator}>
            <AuthUserProvider bundleId={bundleId}>
              <ModalProvider>
                <PopupProvider>
                  <Permission />
                  <Home />
                </PopupProvider>
              </ModalProvider>
            </AuthUserProvider>
          </ServerProvider>
        </LanguageProvider>
      </CacheProvider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
});
