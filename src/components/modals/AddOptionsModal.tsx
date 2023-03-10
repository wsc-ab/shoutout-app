import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import LanguageContext from '../../contexts/Language';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';

import DefaultText from '../defaults/DefaultText';
import {localizations} from './AddOptionsModal.localizations';

type TProps = {
  onCancel: () => void;
  onSuccess: (name: string) => void;
  options: {
    mode: 'camera' | 'library' | 'both';
  };
};

const AddOptionsModal = ({onCancel, onSuccess, options}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];

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
              title={localization.image}
              style={styles.option}
              onPress={() => onSuccess('cameraPhoto')}
              textStyle={{fontWeight: 'bold'}}
            />
            <DefaultText
              title={localization.video}
              style={styles.option}
              onPress={() => onSuccess('cameraVideo')}
              textStyle={{fontWeight: 'bold'}}
            />
          </>
        )}
        {['library', 'both'].includes(options.mode) && (
          <DefaultText
            title={localization.library}
            style={styles.option}
            onPress={() => onSuccess('library')}
            textStyle={{fontWeight: 'bold'}}
          />
        )}
        <DefaultText
          title={localization.cancel}
          style={styles.option}
          onPress={onCancel}
          textStyle={{fontWeight: 'bold', color: defaultRed.lv1}}
        />
      </View>
    </DefaultBottomModal>
  );
};

export default AddOptionsModal;

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
