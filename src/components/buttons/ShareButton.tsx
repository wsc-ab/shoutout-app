import React, {useContext, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import {createShareLink} from '../../utils/Share';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import openShareModal from '../modals/ShareModal';

type TProps = {
  input: {
    title: string;
    target: {collection: string; id: string; path?: string};
    image?: {path: string; type: 'video' | 'image'};
  };
  style?: TStyleView;
};

const ShareButton = ({input, style}: TProps) => {
  const {bundleId} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);

  const onShare = async () => {
    try {
      setSubmitting(true);

      const type =
        bundleId === 'app.airballoon.Shoutout' ? 'development' : 'production';

      const shareLink = await createShareLink({...input, type});
      await openShareModal({title: input.title, url: shareLink});
    } catch (error) {
      DefaultAlert({
        title: 'Failed to open share modal',
        message: (error as {message: string}).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Pressable
      style={[styles.container, style]}
      disabled={submitting}
      onPress={onShare}>
      {!submitting && <DefaultIcon icon="share" size={20} color={'white'} />}
      {submitting && <ActivityIndicator />}
    </Pressable>
  );
};

export default ShareButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
