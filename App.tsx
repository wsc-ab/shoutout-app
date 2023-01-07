/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {AuthUserProvider} from './src/AuthUser';
import Home from './src/Home';
import {initFirebase} from './src/utils/Firebase';

const App = () => {
  const [status, setStatus] = useState<'error' | 'loading' | 'loaded'>(
    'loading',
  );
  useEffect(() => {
    const load = async () => {
      try {
        initFirebase();

        setStatus('loaded');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  if (status === 'loading') {
    return null;
  }

  return (
    <NavigationContainer>
      <AuthUserProvider>
        <SafeAreaView style={{flex: 1, margin: 20}}>
          <Home />
        </SafeAreaView>
      </AuthUserProvider>
    </NavigationContainer>
  );
};

export default App;
