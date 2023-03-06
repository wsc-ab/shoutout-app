import React from 'react';
import {StyleSheet} from 'react-native';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';

import DefaultText from '../defaults/DefaultText';

type TProps = {onCancel: () => void; onSuccess: (name: string) => void};

const VideoModeModal = ({onCancel, onSuccess}: TProps) => {
  return (
    <DefaultBottomModal onCancel={onCancel}>
      <DefaultText
        title="Camera"
        style={styles.option}
        onPress={() => onSuccess('camera')}
        textStyle={{fontWeight: 'bold'}}
      />
      <DefaultText
        title="Library"
        style={styles.option}
        onPress={() => onSuccess('library')}
        textStyle={{fontWeight: 'bold'}}
      />
      <DefaultText
        title="Cancel"
        style={styles.option}
        onPress={onCancel}
        textStyle={{fontWeight: 'bold', color: defaultRed.lv1}}
      />
    </DefaultBottomModal>
  );
};

export default VideoModeModal;

const styles = StyleSheet.create({
  option: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: defaultBlack.lv4(1),
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
});
