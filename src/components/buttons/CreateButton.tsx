import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from '../../contexts/AuthUser';

import {createContent, deleteContent} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import {getSubmitDate} from '../../utils/Date';
import {uploadContent} from '../../utils/Storage';
import DefaultForm from '../defaults/DefaultForm';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

type TProps = {style: TStyleView; onModal: (visible: boolean) => void};

const CreateButton = ({style, onModal}: TProps) => {
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
        setSubmitting(true);
        await deleteContent({content: {id: content.id}});
        setProgress(0);
        setSubmitting(false);
        onModal(false);
        setModal(undefined);
      } catch (error) {
        Alert.alert('Please retry', (error as {message: string}).message);
      }
    };

    Alert.alert(
      'Please confirm',
      "Delete this content? It will no longer show up in rankings, and others won't be able to shoutout this content.",
      [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    );
  };

  const submitDate = getSubmitDate();

  const {height, width} = useWindowDimensions();

  return (
    <View style={style}>
      {content && !submitting && (
        <DefaultIcon
          icon="check"
          onPress={() => {
            onModal(true);
            setModal('done');
          }}
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
              onPress: () => {
                onModal(false);
                setModal(undefined);
              },
            }}>
            <DefaultText
              title={`This will receive shoutouts from ${
                submitDate.getMonth() + 1
              }/${submitDate.getDate()} ${submitDate.getHours()}:00 to ${
                submitDate.getMonth() + 1
              }/${submitDate.getDate() + 1} ${submitDate.getHours() - 1}:59.`}
              style={{zIndex: 100}}
            />

            {content && (
              <ContentCard
                content={content}
                contentStyle={{
                  width,
                  height,
                }}
              />
            )}
            <View style={styles.icons}>
              <DefaultIcon
                icon="rotate"
                onPress={() => Alert.alert('Not yet implemented')}
              />
              {!submitting && <DefaultIcon icon="times" onPress={onDelete} />}
              {submitting && <ActivityIndicator style={{paddingRight: 10}} />}
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
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 40,
    paddingHorizontal: 20,
  },
});
