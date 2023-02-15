import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {createMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getLatLng} from '../../utils/Location';
import {takeAndUploadVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  style?: TStyleView;
};

const CreateButton = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number>();

  const onAdd = async () => {
    onUpdate({target: 'video'});
    setSubmitting(true);

    const latlng = await getLatLng();

    DefaultAlert({
      title: 'Select one',
      message:
        'Would you like to share the new moment with everyone or just friends?',
      buttons: [
        {
          text: 'Everyone',
          onPress: async () => {
            try {
              await onCreate('everyone');
            } catch (error) {
              console.log('onCreate error:', error);
            }
          },
        },
        {
          text: 'Friends',
          onPress: async () => {
            try {
              await onCreate('friends');
            } catch (error) {
              console.log('onCreate error:', error);

              throw new Error('cancel');
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            setSubmitting(false);
          },
        },
      ],
    });

    const onCreate = async (createType: 'friends' | 'everyone') => {
      try {
        const momentId = firebase.firestore().collection('moments').doc().id;

        const path = await takeAndUploadVideo({
          onProgress: setProgress,
          id: momentId,
          userId: authUserData.id,
          onTake: () => onUpdate(undefined),
        });
        setSubmitting(false);
        setProgress(undefined);

        await createMoment({
          moment: {
            id: momentId,
            path,
            latlng,
            type: createType,
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
        setProgress(undefined);
        onUpdate(undefined);
      }
    };
  };

  return (
    <View style={[styles.container, style]}>
      {!submitting && (
        <DefaultIcon icon="video" onPress={onAdd} size={20} color={'white'} />
      )}
      {!!(submitting && !progress) && (
        <ActivityIndicator style={styles.act} color="white" />
      )}
      {!!(submitting && progress) && (
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
  progress: {padding: 10},
  act: {padding: 10},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
