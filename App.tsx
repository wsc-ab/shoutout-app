/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {firebase} from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import DefaultImage from './src/DefaultImage';
import DefaultVideo from './src/DefaultVideo';
import {uploadContent} from './src/utils/storage';

const App = () => {
  const onImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      videoQuality: 'high',
      selectionLimit: 1,
    };
    const {assets} = await launchImageLibrary(options);

    const asset = assets?.[0];

    if (!asset) {
      return;
    }

    const uploaded = await uploadContent({
      asset,
      id: 'id',
      onProgress: prog => console.log(prog, 'prog'),
    });

    await firebase.firestore().collection('contents').doc().set({
      content: uploaded,
      type: asset.type,
    });
  };

  const [data, setData] = useState();
  const [status, setStatus] = useState('loading');

  console.log(data, 'data');

  useEffect(() => {
    const load = async () => {
      const loaded = [];

      (await firebase.firestore().collection('contents').get()).docs.forEach(
        doc => loaded.push(doc.data()),
      );

      setData(loaded);
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar />
        <Pressable onPress={onImage}>
          <Text>Upload</Text>
        </Pressable>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{flex: 1, backgroundColor: 'white'}}>
          {data?.map(item => {
            if (item.type?.includes('image')) {
              return (
                <DefaultImage
                  image={item.content}
                  style={{width: 300, height: 300}}
                />
              );
            } else {
              return <DefaultVideo path={item.content} />;
            }
          })}
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
