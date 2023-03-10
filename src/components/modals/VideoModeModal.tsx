import React from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';

import DefaultText from '../defaults/DefaultText';

type TProps = {
  onCancel: () => void;
  onSuccess: (name: string) => void;
  options: {
    mode: 'camera' | 'library' | 'both';
  };
};

const VideoModeModal = ({onCancel, onSuccess, options}: TProps) => {
  return (
    <DefaultBottomModal onCancel={onCancel}>
      <View
        style={{
          bottom: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          paddingBottom: 24,
          marginHorizontal: 10,
        }}>
        {['camera', 'both'].includes(options.mode) && (
          <>
            <DefaultText
              title="Take photo"
              style={styles.option}
              onPress={() => onSuccess('cameraPhoto')}
              textStyle={{fontWeight: 'bold'}}
            />
            <DefaultText
              title="Take video"
              style={styles.option}
              onPress={() => onSuccess('cameraVideo')}
              textStyle={{fontWeight: 'bold'}}
            />
          </>
        )}
        {['library', 'both'].includes(options.mode) && (
          <DefaultText
            title="Open library"
            style={styles.option}
            onPress={() => onSuccess('library')}
            textStyle={{fontWeight: 'bold'}}
          />
        )}
        <DefaultText
          title="Cancel"
          style={styles.option}
          onPress={onCancel}
          textStyle={{fontWeight: 'bold', color: defaultRed.lv1}}
        />
      </View>
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
