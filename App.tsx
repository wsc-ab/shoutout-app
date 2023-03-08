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
import Home from './src/components/screen/Home';
import {AuthUserProvider} from './src/contexts/AuthUser';
import {CacheProvider} from './src/contexts/Cache';
import {LanguageProvider} from './src/contexts/Language';
import {ModalProvider} from './src/contexts/Modal';
import {PopupProvider} from './src/contexts/Popup';
import {TBundleId} from './src/types/Data';
import {TStatus} from './src/types/Screen';
import {initAlgolia} from './src/utils/Algolia';
import {initFirebase} from './src/utils/Firebase';
import './src/utils/FontAwesome';

type TProps = {
  bundleId: TBundleId;
};

const App = ({bundleId}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = () => {
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
        <LanguageProvider>
          <AuthUserProvider bundleId={bundleId}>
            <PopupProvider>
              <ModalProvider>
                <Home />
              </ModalProvider>
            </PopupProvider>
          </AuthUserProvider>
        </LanguageProvider>
      </CacheProvider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
});
