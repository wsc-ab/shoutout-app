import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
import {TStyleView} from '../../types/Style';
import {checkLocationPermission} from '../../utils/Location';
import {onUploading} from '../../utils/Upload';
import {takeVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';

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
  const {status} = useContext(UploadingContext);

  const onAdd = async () => {
    onUpdate({target: 'video'});

    setSubmitting(true);

    const permitted = await checkLocationPermission();

    const momentId = firebase.firestore().collection('moments').doc().id;

    if (!permitted) {
      DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    try {
      const {remotePath, localPath} = await takeVideo({
        id: momentId,
        userId: authUserData.id,
      });

      onUpdate({
        target: 'createMoment',
        data: {remotePath, localPath, id: momentId, room},
      });

      if (onSuccess) {
        onSuccess();
      }
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

  return (
    <Pressable
      style={[styles.container, style]}
      disabled={submitting}
      onPress={status === 'ready' ? onAdd : onUploading}>
      {!submitting && (
        <DefaultIcon icon="square-plus" size={20} color={color} />
      )}
      {submitting && <ActivityIndicator color="white" />}
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
