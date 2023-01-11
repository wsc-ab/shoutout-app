import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from '../../contexts/AuthUser';

import {createContent, deleteContent} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import {getStartDate} from '../../utils/Date';
import {uploadContent} from '../../utils/Storage';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

type TProps = {style: TStyleView};

const CreateButton = ({style}: TProps) => {
  const {authUserData, content} = useContext(AuthUserContext);

  const [submitting, setSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const selectContent = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      videoQuality: 'high',
      selectionLimit: 1,
    };

    let asset;

    try {
      const {assets} = await launchImageLibrary(options);
      asset = assets?.[0];
    } catch (error) {
      Alert.alert('Please retry', 'Failed to launch library');
    }

    return asset;
  };

  const selectAndUploadContent = async () => {
    const asset = await selectContent();

    if (!asset) {
      return {uploaded: undefined, asset: undefined};
    }

    let uploaded;

    try {
      setSubmitting(true);
      uploaded = await uploadContent({
        asset,
        id: authUserData.id,
        onProgress: setProgress,
      });
    } catch (error) {
      console.log(error, 'e');

      Alert.alert('Please retry', 'Invalid file');
      setSubmitting(false);
    }

    return {uploaded, asset};
  };

  const onAdd = async () => {
    try {
      setSubmitting(true);

      const {uploaded, asset} = await selectAndUploadContent();

      if (!uploaded) {
        return;
      }
      const contentId = firebase.firestore().collection('contents').doc().id;

      await createContent({
        content: {id: contentId, path: uploaded, type: asset.type},
      });
    } catch (error) {
      Alert.alert('Please retry', 'Failed upload content');
    } finally {
      setSubmitting(false);
    }
  };

  const [modal, setModal] = useState<'done'>();

  const onDelete = () => {
    const onPress = async () => {
      if (!content) {
        return;
      }
      try {
        await deleteContent({content: {id: content.id}});
        setProgress(0);
        setModal(undefined);
      } catch (error) {}
    };

    Alert.alert(
      'Please confirm',
      "Delete this content? It will no longer show up in rankings, and others won't be able to shoutout this content.",
      [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    );
  };

  const startDate = getStartDate();

  return (
    <View style={style}>
      {content && !submitting && (
        <DefaultIcon
          icon="check"
          onPress={() => setModal('done')}
          style={styles.icon}
        />
      )}
      {!content && !submitting && (
        <DefaultIcon icon="plus" onPress={onAdd} style={styles.icon} />
      )}
      {submitting && progress === 0 && <ActivityIndicator style={styles.act} />}
      {submitting && progress !== 0 && (
        <DefaultText
          title={Math.round(progress).toString()}
          style={styles.progress}
        />
      )}
      {modal === 'done' && (
        <DefaultModal>
          <DefaultForm
            title="Content"
            left={{
              onPress: () => setModal(undefined),
            }}>
            <DefaultText
              title={`This will be shown starting at ${
                startDate.getMonth() + 1
              }/${startDate.getDate()} ${startDate.getHours()}:00.`}
            />
            <DefaultDivider />

            {content && <ContentCard content={content} />}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingBottom: 50,
                justifyContent: 'space-between',
              }}>
              <DefaultIcon
                icon="rotate"
                onPress={() => Alert.alert('Not yet implemented')}
              />
              <DefaultIcon
                icon="times"
                style={{marginLeft: 10}}
                onPress={onDelete}
              />
            </View>
          </DefaultForm>
        </DefaultModal>
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
