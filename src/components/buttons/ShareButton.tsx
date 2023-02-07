import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import {createShareLink} from '../../utils/Share';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import openShareModal from '../modals/ShareModal';

type TProps = {
  input: {
    target: 'development' | 'production';
    title: string;
    param: string;
    value: string;
    image?: {path: string; type: 'video' | 'image'};
  };
  style?: TStyleView;
};

const ShareButton = ({input, style}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onShare = async () => {
    try {
      setSubmitting(true);
      const shareLink = await createShareLink(input);
      await openShareModal({title: input.title, url: shareLink});
    } catch (error) {
      DefaultAlert({title: 'Failed to open share modal'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {!submitting && (
        <View style={[styles.container, style]}>
          <DefaultIcon
            icon="share"
            onPress={onShare}
            size={25}
            color={'white'}
          />
        </View>
      )}
      {submitting && <ActivityIndicator style={styles.act} />}
    </View>
  );
};

export default ShareButton;

const styles = StyleSheet.create({
  act: {paddingHorizontal: 10},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
