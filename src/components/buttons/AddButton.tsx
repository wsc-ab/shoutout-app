import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addMoment} from '../../functions/Moment';
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
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(authUserData.contributeTo.ids.includes(id));
  }, [authUserData.contributeTo.ids, id]);

  const onAdd = async () => {
    onUpdate({target: 'video'});
    setProgress(undefined);
    setSubmitting(true);

    try {
      const latlng = await getLatLng();

      const path = await takeAndUploadVideo({
        onProgress: setProgress,
        id,
        userId: authUserData.id,
        onTake: () => onUpdate(undefined),
      });
      setProgress(undefined);

      await addMoment({
        moment: {id, path, latlng},
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

  return (
    <View style={[styles.container, style]}>
      {!submitting && (
        <DefaultIcon
          icon="reply-all"
          onPress={onAdd}
          size={20}
          color={added ? defaultRed.lv2 : 'white'}
        />
      )}
      {submitting && !progress && (
        <ActivityIndicator style={styles.act} color="white" />
      )}
      {submitting && progress && (
        <DefaultText
          title={Math.round(progress).toString()}
          style={styles.progress}
        />
      )}
      <DefaultText title={number.toString()} />
    </View>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  progress: {padding: 10},
  act: {padding: 10},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
