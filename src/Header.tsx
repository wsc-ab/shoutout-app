import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from './AuthUser';
import DefaultText from './DefaultText';
import {createContent} from './functions/content';
import RankModal from './RankModal';
import UserModal from './UserModal';
import {uploadContent} from './utils/storage';

const Header = () => {
  const [modal, setModal] = useState<'me' | 'rank'>();
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

  const hideModal = () => setModal(undefined);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModal('me')} style={styles.left}>
        <DefaultText title="Me" />
      </Pressable>
      <Pressable onPress={() => setModal('rank')} style={styles.center}>
        <DefaultText title="Rank" />
      </Pressable>
      <Pressable onPress={onAdd} style={styles.right}>
        <DefaultText title="+" />
      </Pressable>
      {modal === 'me' && <UserModal onCancel={hideModal} />}
      {modal === 'rank' && <RankModal onCancel={hideModal} />}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  left: {flex: 1, alignItems: 'flex-start'},
  center: {flex: 1, alignItems: 'center'},
  right: {flex: 1, alignItems: 'flex-end'},
});
