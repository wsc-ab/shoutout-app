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

  const onAdd = async () => {
    onUpdate({target: 'video'});
    setSubmitting(true);

    try {
      const latlng = await getLatLng();

      const path = await takeAndUploadVideo({
        onCancel: () => setSubmitting(false),
        onProgress: setProgress,
        userId: authUserData.id,
      });

      await addMoment({
        moment: {id, path, latlng},
      });
      setAdded(true);
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });

      setAdded(false);
    } finally {
      setSubmitting(false);
      onUpdate(undefined);
    }
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
            icon="reply-all"
            onPress={onAdd}
            size={20}
            color={added ? defaultRed.lv2 : 'white'}
          />
          <DefaultText title={number.toString()} />
        </View>
      )}
      {submitting && !progress && <ActivityIndicator style={styles.act} />}
      {submitting && progress && (
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
  act: {paddingHorizontal: 10},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
