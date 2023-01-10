import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from '../contexts/AuthUser';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import {createContent, deleteContent} from '../functions/Content';
import {TObject} from '../types/firebase';
import {TStyleView} from '../types/style';
import {getSecondsGap} from '../utils/Date';
import {uploadContent} from '../utils/storage';
import ContentCard from './ContentCard';
import DefaultIcon from './DefaultIcon';

type TProps = {style: TStyleView};

const CreateButton = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const [submitting, setSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const [content, setContent] = useState<TObject>();

  useEffect(() => {
    setContent(authUserData?.contributeTo?.contents?.items?.[0] ?? undefined);
  }, [authUserData?.contributeTo?.contents?.items]);

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
      Alert.alert('Please retry', 'Invalid file');
      setSubmitting(false);
    }

    return {uploaded, asset};
  };

  const onAdd = async () => {
    const {uploaded, asset} = await selectAndUploadContent();

    if (!uploaded) {
      return;
    }

    try {
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
      try {
        await deleteContent({content: {id: content.id}});
        setModal(undefined);
      } catch (error) {
        console.log(error, 'e');
      }
    };

    Alert.alert(
      'Please confirm',
      "Delete this content? It will no longer show up in rankings, and others won't be able to shoutout this content.",
      [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    );
  };

  const nextSubmitDate = new Date();

  nextSubmitDate.setDate(nextSubmitDate.getDate() + 1);
  nextSubmitDate.setHours(8, 59, 59, 999);

  const isSubmitted = content?.createdAt
    ? getSecondsGap({
        date: nextSubmitDate,
        timestamp: content.createdAt,
      }) > 0
    : false;

  return (
    <View style={style}>
      {isSubmitted && !submitting && (
        <DefaultIcon
          icon="check"
          onPress={() => setModal('done')}
          style={styles.icon}
        />
      )}
      {!isSubmitted && !submitting && (
        <DefaultIcon icon="plus" onPress={onAdd} style={styles.icon} />
      )}
      {submitting && (
        <DefaultText
          title={Math.round(progress).toString()}
          style={styles.progress}
        />
      )}
      {modal === 'done' && (
        <DefaultModal>
          <DefaultForm
            title="Content"
            style={{flex: 1}}
            left={{
              onPress: () => setModal(undefined),
            }}>
            <DefaultText title="This will start to show to others at next 09:00 am." />
            <View
              style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
            />
            {content && <ContentCard content={content} />}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
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
});
