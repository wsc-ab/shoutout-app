import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import PopupContext from '../../contexts/Popup';
import {TStyleView} from '../../types/Style';
import {checkLocationPermission} from '../../utils/Location';
import {onUploading} from '../../utils/Upload';
import {takeMoment} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import VideoModeModal from '../modals/VideoModeModal';

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
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const {uploading} = useContext(PopupContext);

  const [modal, setModal] = useState<'mode'>();

  const onAdd = async (mode: 'cameraPhoto' | 'cameraVideo' | 'library') => {
    onUpdate({target: 'takeMoment'});

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
      const {remotePath, localPath, media} = await takeMoment({
        mode: serverMode,
        id: momentId,
        userId: authUserData.id,
        mediaType:
          mode === 'library'
            ? 'mixed'
            : mode === 'cameraPhoto'
            ? 'photo'
            : 'video',
      });

      onUpdate({
        target: 'createMoment',
        data: {
          remotePath,
          localPath,
          id: momentId,
          content: {mode: serverMode, media},
          channel,
        },
      });
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      onUpdate(undefined);
    } finally {
      setSubmitting(false);
      setModal(undefined);
    }
  };

  const onPress = () => {
    if (uploading) {
      return onUploading();
    }

    setModal('mode');
  };

  return (
    <Pressable
      style={[styles.container, style]}
      disabled={submitting}
      onPress={onPress}>
      {!submitting && (
        <DefaultIcon icon="square-plus" size={20} color={color} />
      )}
      {submitting && <ActivityIndicator color="white" />}
      {modal === 'mode' && (
        <VideoModeModal
          onCancel={() => setModal(undefined)}
          options={channel.options}
          onSuccess={mode => {
            onAdd(mode);
          }}
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
