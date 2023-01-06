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
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import ContentCard from './src/ContentCard';
import {uploadContent} from './src/utils/storage';

const App = () => {
  const onAdd = async () => {
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
      path: uploaded,
      type: asset.type,
    });
  };

  const [index, setIndex] = useState(0);

  const [data, setData] = useState<{path: string; type: string}[]>([]);

  useEffect(() => {
    const load = async () => {
      const loaded: {path: string; type: string}[] = [];

      (await firebase.firestore().collection('contents').get()).docs.forEach(
        doc => loaded.push(doc.data() as {path: string; type: string}),
      );

      setData(loaded);
    };

    load();
  }, []);

  const onNext = () => setIndex(pre => (pre + 1) % data.length);

  const [screen, setScreen] = useState<'contents' | 'rank'>('contents');

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <Pressable onPress={() => setScreen('contents')}>
            <Text>Contents</Text>
          </Pressable>
          <Pressable onPress={() => setScreen('rank')}>
            <Text>Rank</Text>
          </Pressable>
        </View>
        <View style={{flex: 1}}>
          {screen === 'rank' && <Text>Ranking of yesterday</Text>}
          {screen === 'contents' && data.length >= 1 && (
            <ContentCard content={data[index]} />
          )}
        </View>
        <View style={styles.nav}>
          <Pressable onPress={onNext}>
            <Text>Next</Text>
          </Pressable>

          <Pressable onPress={onAdd}>
            <Text>+</Text>
          </Pressable>
          <Pressable>
            <Text>Shoutout</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});
