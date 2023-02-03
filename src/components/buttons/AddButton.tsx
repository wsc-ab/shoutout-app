import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getCurrentLocation} from '../../utils/Location';
import {uploadVideo} from '../../utils/Video';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  style?: TStyleView;
};

const AddButton = ({id, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const onAdd = async () => {
    try {
      setSubmitting(true);
      onUpdate('reply');

      const location = await getCurrentLocation();

      const {uploaded} = await uploadVideo({
        authUserData,
        setProgress,
        setSubmitting,
      });

      if (!uploaded) {
        return;
      }

      setAdded(true);
      await addMoment({
        moment: {id, path: uploaded, location},
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });

      setAdded(false);
    } finally {
      onUpdate(undefined);
      setSubmitting(false);
    }
  };

  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(authUserData.contributeTo.ids.includes(id));
  }, [authUserData.contributeTo.ids, id]);

  return (
    <View style={style}>
      {!submitting && (
        <DefaultIcon
          icon="reply-all"
          onPress={onAdd}
          size={25}
          color={added ? defaultRed.lv2 : 'white'}
        />
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

export default AddButton;

const styles = StyleSheet.create({
  progress: {padding: 10},
  act: {paddingHorizontal: 10},
});
