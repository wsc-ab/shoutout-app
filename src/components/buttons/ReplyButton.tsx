import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addLink, createContent} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import {selectAndUploadContent} from '../../utils/Content';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  linkIds: string[];
  style?: TStyleView;
};

const ReplyButton = ({id, linkIds, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const onReply = async () => {
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

      setIsReplyed(true);
      await createContent({
        content: {
          id: contentId,
          path: uploaded,
          type: asset.type,
          isFirst: false,
        },
      });
      await addLink({
        from: {id: contentId},
        to: {id},
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });

      setIsReplyed(false);
    } finally {
      setSubmitting(false);
    }
  };

  const [isReplyed, setIsReplyed] = useState(false);

  useEffect(() => {
    setIsReplyed(
      authUserData.contributeTo?.ids.some((elId: string) =>
        linkIds.includes(elId),
      ),
    );
  }, [authUserData.contributeTo?.ids, linkIds]);

  return (
    <View style={style}>
      <DefaultIcon
        icon="reply"
        onPress={onReply}
        color={isReplyed ? defaultRed.lv1 : 'white'}
      />
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

export default ReplyButton;

const styles = StyleSheet.create({
  progress: {padding: 10},
  act: {paddingHorizontal: 10},
});
