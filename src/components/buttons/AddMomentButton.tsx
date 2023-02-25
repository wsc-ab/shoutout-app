import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
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
  const {status} = useContext(UploadingContext);

  const onAdd = async () => {
    onUpdate({target: 'video'});

    setSubmitting(true);

    const permitted = await checkLocationPermission();

    if (!permitted) {
      DefaultAlert({
        title: 'Error',
        message: 'No location permission',
      });
    }

    try {
      const {remotePath, localPath} = await takeVideo({
        id,
        userId: authUserData.id,
      });

      onUpdate({
        target: 'addMoment',
        data: {remotePath, localPath, id},
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

  const onAdded = () => {
    DefaultAlert({
      title: 'Great!',
      message: "You've already connected to this moment!",
    });
  };

  return (
    <View style={[styles.container, style]}>
      {!submitting && (
        <DefaultIcon
          icon="plus"
          onPress={status === 'ready' ? (added ? onAdded : onAdd) : onUploading}
          size={20}
          color={added ? defaultRed.lv2 : 'white'}
        />
      )}
      {submitting && <ActivityIndicator color="white" />}
    </View>
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
