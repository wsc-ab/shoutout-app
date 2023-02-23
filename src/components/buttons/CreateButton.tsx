import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {checkLocationPermission} from '../../utils/Location';
import {takeAndUploadVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
  onCreate: () => void;
};

const CreateButton = ({style, onCreate}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);

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
      const momentId = firebase.firestore().collection('moments').doc().id;

      await takeAndUploadVideo({
        id: momentId,
        userId: authUserData.id,
        onTake: (path: string) =>
          onUpdate({
            target: 'create',
            data: {path},
          }),
      });
      onCreate();
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

  return (
    <View style={[styles.container, style]}>
      {!submitting && <DefaultIcon icon="video" onPress={onAdd} size={20} />}
      {submitting && <ActivityIndicator style={styles.act} color="white" />}
    </View>
  );
};

export default CreateButton;

const styles = StyleSheet.create({
  act: {padding: 10},
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 20,
  },
});
