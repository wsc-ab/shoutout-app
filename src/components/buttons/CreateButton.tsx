import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from '../../contexts/AuthUser';

import {createContent} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import {uploadContent} from '../../utils/Storage';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import ContentModal from '../modals/ContentModal';

type TProps = {style: TStyleView; onModal: (visible: boolean) => void};

const CreateButton = ({style, onModal}: TProps) => {
  const {authUserData, content} = useContext(AuthUserContext);

  const [submitting, setSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const selectContent = async () => {
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
      DefaultAlert({
        title: 'Error',
        message: 'Failed to launch library',
      });
    }

    return asset;
  };

  const selectAndUploadContent = async () => {
    const asset = await selectContent();

    if (!asset) {
      return {uploaded: undefined, asset: undefined};
    }

    if (asset.duration && asset.duration > 30) {
      DefaultAlert({
        title: 'Video is too long',
        message: ' Please select a video with less than 30 seconds.',
      });
      return {uploaded: undefined, asset: undefined};
    }

    let uploaded;

    try {
      setSubmitting(true);
      uploaded = await uploadContent({
        asset,
        id: authUserData.id,
        onProgress: setProgress,
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: 'This file is not supported',
      });

      setSubmitting(false);
    }

    return {uploaded, asset};
  };

  const onAdd = async () => {
    try {
      setSubmitting(true);

      const {uploaded, asset} = await selectAndUploadContent();

      if (!uploaded) {
        return;
      }
      const contentId = firebase.firestore().collection('contents').doc().id;

      await createContent({
        content: {id: contentId, path: uploaded, type: asset.type},
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const [modal, setModal] = useState<'done'>();

  return (
    <View style={style}>
      {content && !submitting && (
        <DefaultIcon
          icon="check"
          onPress={() => {
            onModal(true);
            setModal('done');
          }}
          style={styles.icon}
        />
      )}
      {!content && !submitting && (
        <DefaultIcon icon="plus" onPress={onAdd} style={styles.icon} />
      )}
      {submitting && progress === 0 && <ActivityIndicator style={styles.act} />}
      {submitting && progress !== 0 && (
        <DefaultText
          title={Math.round(progress).toString()}
          style={styles.progress}
        />
      )}
      {modal === 'done' && (
        <ContentModal
          content={content}
          onCancel={() => {
            onModal(false);
            setModal(undefined);
            setProgress(0);
          }}
        />
      )}
    </View>
  );
};

export default CreateButton;

const styles = StyleSheet.create({
  icon: {alignItems: 'flex-end'},
  progress: {alignItems: 'flex-end', padding: 10},
  act: {alignItems: 'flex-end', paddingHorizontal: 10},
});
