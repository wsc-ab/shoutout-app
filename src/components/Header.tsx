import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from '../contexts/AuthUser';
import DefaultText from '../defaults/DefaultText';
import {createContent} from '../functions/content';
import {uploadContent} from '../utils/storage';
import BestModal from './BestModal';
import UserModal from './UserModal';

const Header = () => {
  const [modal, setModal] = useState<'me' | 'best'>();
  const {authUserData} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(true);
      uploaded = await uploadContent({
        asset,
        id: authUserData.id,
        onProgress: prog => console.log(prog, 'prog'),
      });
    } catch (error) {
      Alert.alert('Please retry', 'Invalid file');
      setSubmitting(false);
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
    } finally {
      setSubmitting(false);
    }
  };

  const hideModal = () => setModal(undefined);

  return (
    <View style={styles.container}>
      <DefaultText
        title="Me"
        onPress={() => setModal('me')}
        style={styles.left}
      />

      <DefaultText
        title="Best"
        onPress={() => setModal('best')}
        style={styles.center}
      />

      {!submitting && (
        <DefaultText title="+" onPress={onAdd} style={styles.right} />
      )}
      {submitting && <ActivityIndicator />}

      {modal === 'me' && <UserModal onCancel={hideModal} />}
      {modal === 'best' && <BestModal onCancel={hideModal} />}
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
