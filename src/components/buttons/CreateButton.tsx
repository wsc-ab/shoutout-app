import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
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
import {getStartDate} from '../../utils/Date';
import {uploadContent} from '../../utils/Storage';
import DefaultAlert from '../defaults/DefaultAlert';
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
      DefaultAlert({
        title: 'Error',
        message: 'Failed to launch library',
      });
    }

    return asset;
  };

  const selectAndUploadContent = async () => {
    const asset = await selectContent();

    if (!asset) {
      return {uploaded: undefined, asset: undefined};
    }

    if (asset.duration && asset.duration > 30) {
      DefaultAlert({
        title: 'Video is too long',
        message: ' Please select a video with less than 30 seconds.',
      });
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
      DefaultAlert({
        title: 'Error',
        message: 'This file is not supported',
      });

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
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
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
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
    };

    DefaultAlert({
      title: 'Please confirm',
      message:
        "Delete this content? It will no longer show up in rankings, and others won't be able to shoutout this content.",
      buttons: [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  const startDate = getStartDate();

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
        <DefaultModal style={{paddingHorizontal: 0}}>
          <DefaultForm
            title="Content"
            left={{
              onPress: () => {
                onModal(false);
                setModal(undefined);
              },
            }}>
            {content && (
              <ContentCard
                content={content}
                style={{position: 'absolute', top: 0, left: 0}}
                contentStyle={{
                  width,
                  height,
                }}
              />
            )}
            <View style={styles.icons}>
              <DefaultText
                title={`Will be shown from ${
                  startDate.getMonth() + 1
                }/${startDate.getDate()} ${startDate.getHours()}:00 to ${
                  startDate.getMonth() + 1
                }/${startDate.getDate() + 1} ${startDate.getHours() - 1}:59`}
                style={{flex: 1, paddingVertical: 10}}
              />
              {!submitting && <DefaultIcon icon="times" onPress={onDelete} />}
              {submitting && (
                <ActivityIndicator style={{paddingHorizontal: 10}} />
              )}
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
    bottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
  },
});
