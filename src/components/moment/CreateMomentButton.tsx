import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import {TStyleView} from '../../types/Style';
import {checkLocationPermission} from '../../utils/Location';
import {takeMedia} from '../../utils/Media';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import DefaultIcon from '../defaults/DefaultIcon';
import CreateMomentForm from '../forms/CreateMomentForm';
import {localizations} from '../modals/AddOptionsModal.localizations';

type TProps = {
  style?: TStyleView;
  channel: {
    id: string;
    options: {
      mode: 'camera' | 'library' | 'both';
    };
  };
  color?: string;
};

const CreateMomentButton = ({channel, color = 'white', style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const [modal, setModal] = useState<'options' | 'create'>();
  const [data, setData] = useState<{
    remotePath: string;
    localPath: string;
    content: {media: 'image' | 'video'; mode: 'camera' | 'library'};
    id: string;
  }>();

  const onAdd = async (mode: 'photo' | 'video' | 'library') => {
    setSubmitting(true);

    const permitted = await checkLocationPermission();

    if (!permitted) {
      setSubmitting(false);
      return DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    const momentId = firebase.firestore().collection('moments').doc().id;

    const serverMode = mode === 'library' ? 'library' : 'camera';

    try {
      const {remotePath, localPath, media} = await takeMedia({
        mode: serverMode,
        id: momentId,
        userId: authUserData.id,
        mediaType: mode === 'library' ? 'mixed' : mode,
      });

      setModal('create');
      setData({
        remotePath,
        localPath,
        id: momentId,
        content: {mode: serverMode, media},
      });
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      setSubmitting(false);
    }
  };

  const options: {
    name: 'photo' | 'video' | 'library' | 'cancel';
    title: string;
    type?: 'cancel';
  }[] = [];

  if (['camera', 'both'].includes(channel.options.mode)) {
    options.push({name: 'photo', title: localization.image});
    options.push({name: 'video', title: localization.video});
  }

  if (['library', 'both'].includes(channel.options.mode)) {
    options.push({name: 'library', title: localization.library});
  }

  options.push({
    name: 'cancel',
    title: localization.cancel,
    type: 'cancel',
  });

  return (
    <Pressable
      style={[styles.container, style]}
      disabled={submitting}
      onPress={() => setModal('options')}>
      {!submitting && (
        <DefaultIcon icon="square-plus" size={20} color={color} />
      )}
      {submitting && <ActivityIndicator color="white" />}
      {modal === 'options' && (
        <DefaultBottomModal
          onCancel={() => setModal(undefined)}
          options={options}
          onPress={option => {
            if (option === 'cancel') {
              setModal(undefined);
            } else {
              onAdd(option);
            }
          }}
        />
      )}
      {modal === 'create' && data && (
        <CreateMomentForm
          {...data}
          channel={channel}
          onCancel={() => setModal(undefined)}
          onStart={() => setModal(undefined)}
          onSuccess={() => setSubmitting(false)}
        />
      )}
    </Pressable>
  );
};

export default CreateMomentButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
