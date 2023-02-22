import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {checkLocationPermission} from '../../utils/Location';
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

const AddContentButton = ({id, number, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [submitting, setSubmitting] = useState(false);

  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(authUserData.contributeTo.ids.includes(id));
  }, [authUserData.contributeTo.ids, id]);

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
      await takeAndUploadVideo({
        id,
        userId: authUserData.id,
        onTake: (path: string) =>
          onUpdate({
            target: 'addContent',
            data: {path, id},
          }),
      });
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

  const onAdded = () => {
    DefaultAlert({
      title: 'Error',
      message: "You've already connected to this moment",
    });
  };

  return (
    <View style={[styles.container, style]}>
      {!submitting && (
        <DefaultIcon
          icon="plus"
          onPress={added ? onAdded : onAdd}
          size={20}
          color={added ? defaultRed.lv2 : 'white'}
        />
      )}
      {submitting && <ActivityIndicator style={styles.act} color="white" />}
      <DefaultText title={number.toString()} style={{paddingRight: 5}} />
    </View>
  );
};

export default AddContentButton;

const styles = StyleSheet.create({
  act: {padding: 10},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
