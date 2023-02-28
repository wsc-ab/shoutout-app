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
import CreateMomentForm from '../forms/CreateMomentForm';

type TProps = {
  style?: TStyleView;
  room?: {id: string};
  color?: string;
  onSuccess?: () => void;
};

const CreateMomentButton = ({
  room,
  color = 'white',
  onSuccess,
  style,
}: TProps) => {
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
    onUpdate({target: 'createMoment'});

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
        id: momentId,
        userId: authUserData.id,
      });

      setData({remotePath, localPath, id: momentId});
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

  const onForm = () => {
    onUpdate(undefined);
    setModal(undefined);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Pressable
      style={[styles.container, style]}
      disabled={submitting}
      onPress={uploading ? onUploading : onAdd}>
      {!submitting && (
        <DefaultIcon icon="square-plus" size={20} color={color} />
      )}
      {submitting && <ActivityIndicator color="white" />}
      {modal === 'form' && data && (
        <CreateMomentForm
          {...data}
          room={room}
          onSuccess={onForm}
          onCancel={onForm}
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
