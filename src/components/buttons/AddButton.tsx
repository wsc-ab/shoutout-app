import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addMoment, createMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getLatLng} from '../../utils/Location';
import {takeAndUploadVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  number: number;
  style?: TStyleView;
};

const AddButton = ({id, number, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number>();

  const onAdd = async () => {
    onUpdate({target: 'video'});
    setSubmitting(true);

    DefaultAlert({
      title: 'Select one',
      message: 'Start a new moment or connect to the one you are viewing?',
      buttons: [
        {text: 'Start', onPress: () => onPress('start')},
        {
          text: 'Connect',
          onPress: () => onPress('connect'),
        },
        {
          text: 'Cancel',
          onPress: () => {
            setSubmitting(false);
          },
        },
      ],
    });

    const onPress = async (type: 'start' | 'connect') => {
      try {
        const latlng = await getLatLng();

        let path: string;

        switch (type) {
          case 'start':
            DefaultAlert({
              title: 'Select one',
              message:
                'Would you like to share the new moment with everyone or just friends?',
              buttons: [
                {text: 'Everyone', onPress: () => onCreate('everyone')},
                {
                  text: 'Friends',
                  onPress: () => onCreate('friends'),
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
              const momentId = firebase
                .firestore()
                .collection('moments')
                .doc().id;

              path = await takeAndUploadVideo({
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
            };

            break;

          case 'connect':
            path = await takeAndUploadVideo({
              onProgress: setProgress,
              id,
              userId: authUserData.id,
              onTake: () => onUpdate(undefined),
            });
            setSubmitting(false);
            setProgress(undefined);

            await addMoment({
              moment: {id, path, latlng},
            });
            break;

          default:
            return;
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
        setProgress(undefined);
        onUpdate(undefined);
      }
    };
  };

  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(authUserData.contributeTo.ids.includes(id));
  }, [authUserData.contributeTo.ids, id]);

  return (
    <View style={[styles.container, style]}>
      {!submitting && (
        <View style={[styles.container, style]}>
          <DefaultIcon
            icon="video"
            onPress={onAdd}
            size={20}
            color={added ? defaultRed.lv2 : 'white'}
          />
          <DefaultText title={number.toString()} />
        </View>
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

export default AddButton;

const styles = StyleSheet.create({
  progress: {padding: 10},
  act: {padding: 10},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
