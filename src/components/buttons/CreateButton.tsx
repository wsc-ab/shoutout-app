import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {createMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getCurrentLocation} from '../../utils/Location';
import {uploadVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {style: TStyleView};

const CreateButton = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);

  const [submitting, setSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const onAdd = async () => {
    try {
      setSubmitting(true);
      onUpdate('create');

      const location = await getCurrentLocation();

      const {uploaded} = await uploadVideo({
        authUserData,
        setProgress,
        setSubmitting,
      });

      if (!uploaded) {
        return;
      }
      const momentId = firebase.firestore().collection('moments').doc().id;

      await createMoment({
        moment: {
          id: momentId,
          path: uploaded,
          location,
        },
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setSubmitting(false);
      setProgress(0);
      onUpdate(undefined);
    }
  };

  return (
    <View style={style}>
      {!submitting && (
        <DefaultIcon icon="video" onPress={onAdd} style={styles.icon} />
      )}
      {submitting && progress === 0 && <ActivityIndicator style={styles.act} />}
      {submitting && progress !== 0 && (
        <DefaultText
          title={Math.round(progress).toString()}
          style={styles.progress}
        />
      )}
    </View>
  );
};

export default CreateButton;

const styles = StyleSheet.create({
  icon: {alignItems: 'flex-end'},
  progress: {alignItems: 'flex-end', padding: 10},
  act: {alignItems: 'flex-end', paddingHorizontal: 10},
});
