import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {createMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getLatLng} from '../../utils/Location';
import {takeAndUploadVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {style: TStyleView};

const CreateButton = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);

  const [submitting, setSubmitting] = useState(false);

  const [progress, setProgress] = useState<number>();

  const onAdd = async () => {
    onUpdate({target: 'video'});

    setSubmitting(true);

    DefaultAlert({
      title: 'Select one',
      message:
        'Would you like to share this moment with everyone or just friends?',
      buttons: [
        {text: 'Everyone', onPress: () => onPress('everyone')},
        {
          text: 'Friends',
          onPress: () => onPress('friends'),
        },
        {
          text: 'Cancel',
          onPress: () => {
            setSubmitting(false);
          },
        },
      ],
    });

    const onPress = async (type: 'everyone' | 'friends') => {
      try {
        const momentId = firebase.firestore().collection('moments').doc().id;
        const path = await takeAndUploadVideo({
          onProgress: setProgress,
          id: momentId,
          userId: authUserData.id,
          onTake: () => onUpdate(undefined),
        });
        setProgress(undefined);

        const latlng = await getLatLng();

        await createMoment({
          moment: {
            id: momentId,
            path,
            latlng,
            type,
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
        onUpdate(undefined);
        setProgress(undefined);
        setSubmitting(false);
      }
    };
  };

  return (
    <View style={style}>
      {!submitting && <DefaultIcon icon="plus" onPress={onAdd} size={20} />}

      {!!(submitting && !progress) && <ActivityIndicator color="white" />}
      {!!(submitting && progress) && (
        <DefaultText title={Math.round(progress).toString()} />
      )}
    </View>
  );
};

export default CreateButton;
