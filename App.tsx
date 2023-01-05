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
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';

const App = () => {
  const onImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      videoQuality: 'high',
      selectionLimit: 1,
    };
    const result = await launchImageLibrary(options);
    console.log(result, 'r');
  };
  return (
    <NavigationContainer>
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'} />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <TouchableOpacity onPress={onImage}>
            <Text>Upload</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
