import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import LanguageContext from '../../contexts/Language';
import {TStyleView} from '../../types/Style';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';

import ChannelCodeForm from '../forms/ChannelCodeForm';
import CreateGeneralChannelModal from '../forms/CreateGeneralChannelModal';
import {localizations} from './Channel.localizations';

type TProps = {
  style?: TStyleView;
};

const PlusChannelButton = ({style}: TProps) => {
  const [modal, setModal] = useState<'type' | 'create' | 'join'>();
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];

  const onCancel = () => setModal(undefined);

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
        <DefaultBottomModal
          options={[
            {name: 'create', title: localization.create},
            {name: 'join', title: localization.join},
            {name: 'cancel', title: localization.cancel, type: 'cancel'},
          ]}
          onPress={option => setModal(option === 'cancel' ? undefined : option)}
          onCancel={onCancel}
        />
      )}
      {modal === 'create' && (
        <CreateGeneralChannelModal onCancel={onCancel} onSuccess={onCancel} />
      )}
      {modal === 'join' && (
        <DefaultModal>
          <ChannelCodeForm onCancel={onCancel} onSuccess={onCancel} />
        </DefaultModal>
      )}
    </View>
  );
};

export default PlusChannelButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
