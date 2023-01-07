import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from './AuthUser';
import Contents from './Contents';
import {createContent} from './functions/content';
import RankModal from './RankModal';
import PhoneSignIn from './SignIn';
import UserModal from './UserModal';
import {uploadContent} from './utils/Storage';

const Home = () => {
  const {authUserData} = useContext(AuthUserContext);
  const onAdd = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      videoQuality: 'high',
      selectionLimit: 1,
    };

    let asset;

    try {
      const {assets} = await launchImageLibrary(options);
      asset = assets?.[0];
    } catch (error) {
      Alert.alert('Please retry', 'Failed to launch library');
    }

    if (!asset) {
      return;
    }

    let uploaded;

    try {
      uploaded = await uploadContent({
        asset,
        id: authUserData.id,
        onProgress: prog => console.log(prog, 'prog'),
      });
    } catch (error) {
      Alert.alert('Please retry', 'Invalid file');
    }

    if (!uploaded) {
      return;
    }

    try {
      const contentId = firebase.firestore().collection('contents').doc().id;

      await createContent({
        content: {id: contentId, path: uploaded, type: asset.type},
      });
    } catch (error) {
      Alert.alert('Please retry', 'Failed upload content');
    }
  };

  const [modal, setModal] = useState<'rank' | 'me'>();

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
        <Pressable
          onPress={() => setModal('me')}
          style={{flex: 1, alignItems: 'flex-start'}}>
          <Text>Me</Text>
        </Pressable>
        <Pressable
          onPress={() => setModal('rank')}
          style={{flex: 1, alignItems: 'center'}}>
          <Text>Rank</Text>
        </Pressable>
        <Pressable onPress={onAdd} style={{flex: 1, alignItems: 'flex-end'}}>
          <Text>+</Text>
        </Pressable>
      </View>

      <Contents style={{flex: 1}} />

      {modal === 'me' && <UserModal onCancel={() => setModal(undefined)} />}
      {modal === 'rank' && <RankModal onCancel={() => setModal(undefined)} />}
    </>
  );
};

export default Home;
