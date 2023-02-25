import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import {createShareLink} from '../../utils/Share';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import openShareModal from '../modals/ShareModal';

type TProps = {
  input: {
    title: string;
    param: string;
    value: string;
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

      const target =
        bundleId === 'app.airballoon.Shoutout' ? 'development' : 'production';

      const shareLink = await createShareLink({...input, target});
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
    <View style={[styles.container, style]}>
      {!submitting && (
        <DefaultIcon icon="share" onPress={onShare} size={20} color={'white'} />
      )}
      {submitting && <ActivityIndicator />}
    </View>
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
