import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {Alert, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AuthUserContext from '../contexts/AuthUser';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import {createContent} from '../functions/Content';
import {TStyleView} from '../types/style';
import {getSecondsGap} from '../utils/Date';
import {uploadContent} from '../utils/storage';
import ContentCard from './ContentCard';

type TProps = {style: TStyleView};

const CreateButton = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

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
      return;
    }
    setProgress(0);
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

  const latestContent =
    authUserData.contributeTo.contents?.items?.[0] ?? undefined;

  const nextSubmitDate = new Date();

  nextSubmitDate.setDate(nextSubmitDate.getDate() + 1);
  nextSubmitDate.setHours(8, 59, 59, 999);

  const isSubmitted = latestContent?.createdAt
    ? getSecondsGap({
        date: nextSubmitDate,
        timestamp: latestContent.createdAt,
      }) > 0
    : false;

  const [modal, setModal] = useState<'done'>();

  return (
    <View style={style}>
      {isSubmitted && !submitting && (
        <DefaultText title="Done" onPress={() => setModal('done')} />
      )}
      {!isSubmitted && !submitting && (
        <DefaultText title="Upload" onPress={onAdd} />
      )}
      {submitting && <DefaultText title={Math.round(progress).toString()} />}
      {modal === 'done' && (
        <DefaultModal>
          <DefaultForm
            title="Content"
            left={{
              title: 'Cancel',
              onPress: () => setModal(undefined),
            }}>
            <DefaultText title="This will be submitted at 08:59 am tomorrow." />
            <ContentCard content={latestContent} />
          </DefaultForm>
        </DefaultModal>
      )}
    </View>
  );
};

export default CreateButton;
