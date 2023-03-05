import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
};

const CreateChannelButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => {
        onUpdate({target: 'createChannel'});
      }}>
      <DefaultIcon icon="folder-plus" size={20} />
    </Pressable>
  );
};

export default CreateChannelButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
