import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {createMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {encodeToH264, generateThumb} from '../../utils/Ffmpeg';
import {getLatLng} from '../../utils/Location';
import {createStoragePath, uploadFile} from '../../utils/Storage';
import {takeVideo} from '../../utils/Video';
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
    setProgress(undefined);
    setSubmitting(true);

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

    const onPress = async (type: 'everyone' | 'friends') => {
      try {
        let asset;
        try {
          asset = await takeVideo({
            onCancel: () => setSubmitting(false),
            durationLimit: 10,
          });
        } catch (error) {
          DefaultAlert({
            title: 'Error',
            message: 'Failed to take video',
          });
          setSubmitting(false);
          onUpdate(undefined);
          return;
        }

        if (!asset) {
          onUpdate(undefined);
          return;
        }

        if (asset.duration && asset.duration < 3) {
          DefaultAlert({
            title: 'Video is too short',
            message: 'Video should be at least 3 seconds long.',
          });
          setSubmitting(false);
          return;
        }

        if (!asset.uri) {
          DefaultAlert({
            title: 'Error',
            message: 'Video file path not found.',
          });
          setSubmitting(false);
          return;
        }

        console.log('alert');

        // convert to mp4

        let uri;
        try {
          uri = await encodeToH264({
            input: asset.uri,
          });
        } catch (error) {
          setSubmitting(false);
          return;
        }

        let thumbUri;
        try {
          thumbUri = await generateThumb({
            input: uri,
          });
        } catch (error) {
          setSubmitting(false);
          return;
        }

        const momentId = firebase.firestore().collection('moments').doc().id;
        const videoPath = createStoragePath({
          userId: authUserData.id,
          collection: 'moments',
          id: momentId,
          type: 'video',
        });
        try {
          await uploadFile({
            path: videoPath,
            uri,
            onProgress: setProgress,
          });
        } catch (error) {
          setSubmitting(false);
          return;
        }

        try {
          await uploadFile({
            path: `${videoPath}_thumb`,
            uri: thumbUri,
            onProgress: setProgress,
          });
        } catch (error) {
          setSubmitting(false);
          return;
        }

        const latlng = await getLatLng();

        await createMoment({
          moment: {
            id: momentId,
            path: videoPath,
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
        onUpdate(undefined);
        setSubmitting(false);
      }
    };
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
