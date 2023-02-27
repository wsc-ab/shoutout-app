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
import AddMomentForm from '../forms/AddMomentForm';

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
  const [modal, setModal] = useState<'form'>();
  const [data, setData] = useState<{
    id: string;
    remotePath: string;
    localPath: string;
  }>();

  const onAdd = async () => {
    if (added) {
      return onAdded();
    }
    onUpdate({target: 'addMoment'});

    setSubmitting(true);

    const permitted = await checkLocationPermission();

    if (!permitted) {
      return DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    try {
      const {remotePath, localPath} = await takeVideo({
        id,
        userId: authUserData.id,
      });

      setData({remotePath, localPath, id});
      setModal('form');
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

  const onForm = () => {
    onUpdate(undefined);
    setModal(undefined);
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
      {modal === 'form' && data && (
        <AddMomentForm {...data} onSuccess={onForm} onCancel={onForm} />
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
