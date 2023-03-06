import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import PopupContext from '../../contexts/Popup';
import {TStyleView} from '../../types/Style';
import {checkLocationPermission} from '../../utils/Location';
import {onUploading} from '../../utils/Upload';
import {takeVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import VideoModeModal from '../modals/VideoModeModal';

type TProps = {
  style?: TStyleView;
  channel: {id: string; live: boolean};
  color?: string;
};

const CreateMomentButton = ({channel, color = 'white', style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const {uploading} = useContext(PopupContext);

  const [modal, setModal] = useState<'mode'>();

  const onAdd = async (mode: 'camera' | 'library') => {
    setModal(undefined);
    onUpdate({target: 'takeVideo'});

    setSubmitting(true);

    const permitted = await checkLocationPermission();

    if (!permitted) {
      return DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    const momentId = firebase.firestore().collection('moments').doc().id;

    try {
      const {remotePath, localPath} = await takeVideo({
        mode,
        id: momentId,
        userId: authUserData.id,
      });

      onUpdate({
        target: 'createMoment',
        data: {
          remotePath,
          localPath,
          id: momentId,
          channel,
          options: {live: mode === 'camera'},
        },
      });
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onPress = () => {
    if (uploading) {
      return onUploading();
    }

    if (channel.live) {
      return onAdd('camera');
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
          onSuccess={mode => onAdd(mode)}
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
