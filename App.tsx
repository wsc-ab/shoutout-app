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
import {TStatus} from './src/types/Screen';
import {initFirebase} from './src/utils/Firebase';
import './src/utils/FontAwesome';

const App = () => {
  const [status, setStatus] = useState<TStatus>('loading');

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
      <ModalProvider>
        <AuthUserProvider>
          <Home />
        </AuthUserProvider>
      </ModalProvider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
});
