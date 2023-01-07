import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from './AuthUser';
import Contents from './Contents';
import {createContent} from './functions/content';
import PhoneSignIn from './SignIn';
import {uploadContent} from './utils/Storage';

const Home = () => {
  const {authUserData, onSignOut} = useContext(AuthUserContext);
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
      id: authUserData.id,
      onProgress: prog => console.log(prog, 'prog'),
    });

    const contentId = firebase.firestore().collection('contents').doc().id;

    await createContent({
      content: {id: contentId, path: uploaded, type: asset.type},
    });
  };

  const [screen, setScreen] = useState<'contents' | 'rank'>('contents');

  if (!authUserData) {
    return <PhoneSignIn />;
  }

  return (
    <>
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
        {screen === 'contents' && <Contents />}
      </View>
      <View style={styles.nav}>
        <Pressable onPress={onAdd}>
          <Text>+</Text>
        </Pressable>
        <Pressable onPress={onSignOut}>
          <Text>Signout</Text>
        </Pressable>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});
