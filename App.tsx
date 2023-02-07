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
import {ModalProvider} from './src/contexts/Modal';
import {TBundleId} from './src/types/Data';
import {TStatus} from './src/types/Screen';
import {initFirebase} from './src/utils/Firebase';
import './src/utils/FontAwesome';

type TProps = {
  bundleId: TBundleId;
};

const App = ({bundleId}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');
  console.log(bundleId, 'b');

  useEffect(() => {
    const load = async () => {
      initFirebase();

      setStatus('loaded');
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AuthUserProvider bundleId={'com.airballoon.Shoutout'}>
        <ModalProvider>
          <Home />
        </ModalProvider>
      </AuthUserProvider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
});
