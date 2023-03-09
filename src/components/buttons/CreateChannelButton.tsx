import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

import DefaultText from '../defaults/DefaultText';
import {localizations} from './CreateChannelButton.localizations';

type TProps = {
  style?: TStyleView;
};

const CreateChannelButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const [modal, setModal] = useState<'type'>();

  const onSuccess = (type: string) => {
    switch (type) {
      case 'general':
        onUpdate({target: 'createGeneralChannel'});
        break;

      case 'sponsored':
        onUpdate({target: 'createSponsoredChannel'});
        break;

      default:
        break;
    }
    setModal(undefined);
  };

  return (
    <View>
      <Pressable
        style={[styles.container, style]}
        onPress={() => {
          setModal('type');
        }}>
        <DefaultIcon icon="folder-plus" size={20} />
      </Pressable>
      {modal === 'type' && (
        <ChannelTypeModal
          onCancel={() => setModal(undefined)}
          onSuccess={onSuccess}
        />
      )}
    </View>
  );
};

export default CreateChannelButton;

const ChannelTypeModal = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: (type: string) => void;
}) => {
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
        <DefaultText
          title={localization.general}
          style={styles.option}
          onPress={() => onSuccess('general')}
          textStyle={{fontWeight: 'bold'}}
        />
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: defaultBlack.lv4(1),
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
});
