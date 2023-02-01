import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {createContent} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import {selectAndUploadContent} from '../../utils/Content';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {style: TStyleView};

const CreateButton = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const [submitting, setSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const onAdd = async () => {
    try {
      setSubmitting(true);

      const {uploaded, asset} = await selectAndUploadContent({
        authUserData,
        setProgress,
        setSubmitting,
      });

      if (!uploaded) {
        return;
      }
      const contentId = firebase.firestore().collection('contents').doc().id;

      await createContent({
        content: {
          id: contentId,
          path: uploaded,
          type: asset.type,
          isFirst: true,
        },
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={style}>
      {!submitting && (
        <DefaultIcon icon="plus" onPress={onAdd} style={styles.icon} />
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
