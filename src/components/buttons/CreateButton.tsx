import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {createMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getLatLng} from '../../utils/Location';
import {uploadVideo} from '../../utils/Video';
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
    setSubmitting(true);
    const momentId = firebase.firestore().collection('moments').doc().id;
    const {uploaded} = await uploadVideo({
      authUserData,
      setProgress,
      id: momentId,
      collection: 'moments',
    });
    setSubmitting(false);

    if (!uploaded) {
      return;
    }

    const onPress = async (type: 'everyone' | 'friends') => {
      try {
        setSubmitting(true);
        onUpdate({target: 'video'});

        const latlng = await getLatLng();

        await createMoment({
          moment: {
            id: momentId,
            path: uploaded,
            latlng,
            type,
          },
        });
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      } finally {
        setSubmitting(false);
        onUpdate(undefined);
      }
    };

    DefaultAlert({
      title: 'Select one?',
      message:
        'Who would you like to share this moment with?. Everyone including friends or just friends.',
      buttons: [
        {text: 'Everyone', onPress: () => onPress('everyone')},
        {
          text: 'Friends',
          onPress: () => onPress('friends'),
        },
      ],
    });
  };

  return (
    <View style={style}>
      {!submitting && <DefaultIcon icon="plus" onPress={onAdd} size={20} />}

      {submitting && !progress && <ActivityIndicator />}
      {submitting && progress && (
        <DefaultText title={Math.round(progress).toString()} />
      )}
    </View>
  );
};

export default CreateButton;
