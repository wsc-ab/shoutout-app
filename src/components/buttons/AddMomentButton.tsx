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

type TProps = {
  moment: {id: string};
  style?: TStyleView;
  added: boolean;
};

const AddMomentButton = ({moment: {id}, added, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const {uploading} = useContext(PopupContext);

  const onAdd = async () => {
    if (added) {
      return onAdded();
    }
    onUpdate({target: 'video'});

    setSubmitting(true);

    const permitted = await checkLocationPermission();

    if (!permitted) {
      return DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    try {
      onUpdate(undefined);
      const {remotePath, localPath} = await takeVideo({
        id,
        userId: authUserData.id,
      });

      onUpdate({target: 'addMoment', data: {remotePath, localPath, id}});
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
      onPress={uploading ? onUploading : onAdd}>
      {!submitting && (
        <DefaultIcon
          icon="layer-group"
          size={20}
          color={added ? defaultRed.lv2 : 'white'}
        />
      )}
      {submitting && <ActivityIndicator color="white" />}
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
