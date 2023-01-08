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
import {SafeAreaView} from 'react-native';
import {AuthUserProvider} from './src/contexts/AuthUser';
import Home from './src/screen/Home';
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
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <AuthUserProvider>
        <Home />
      </AuthUserProvider>
    </SafeAreaView>
  );
};

export default App;
