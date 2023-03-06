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
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import VideoModeModal from '../modals/VideoModeModal';

type TProps = {
  moment: {id: string; channel: {id: string; options: {live: boolean}}};
  style?: TStyleView;
  added: boolean;
};

const AddMomentButton = ({moment: {id, channel}, added, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const {uploading} = useContext(PopupContext);

  const [modal, setModal] = useState<'mode'>();

  const onAdd = async (mode: 'camera' | 'library') => {
    onUpdate({target: 'takeVideo'});
    setSubmitting(true);

    const permitted = await checkLocationPermission();

    if (!permitted) {
      setSubmitting(false);
      return DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    try {
      const {remotePath, localPath} = await takeVideo({
        id,
        userId: authUserData.id,
        mode,
      });

      onUpdate({
        target: 'addMoment',
        data: {remotePath, localPath, id, options: {live: mode === 'camera'}},
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
    }
  };

  const onPress = () => {
    if (added) {
      return onAdded();
    }
    if (uploading) {
      return onUploading();
    }

    if (channel.options.live) {
      return onAdd('camera');
    }

    setModal('mode');
  };

  const onAdded = () => {
    DefaultAlert({
      title: 'Great!',
      message: "You've already connected to this moment!",
    });
  };

  return (
    <Pressable
      style={[styles.container, style]}
      disabled={submitting}
      onPress={onPress}>
      {!submitting && (
        <DefaultIcon
          icon="square-plus"
          size={20}
          color={added ? defaultRed.lv2 : 'white'}
        />
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

export default AddMomentButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
