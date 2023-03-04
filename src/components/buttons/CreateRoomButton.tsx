import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
  onSuccess?: () => void;
};

const CreateRoomButton = ({style, onSuccess}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => {
        onUpdate({target: 'createRoom'});
        if (onSuccess) {
          onSuccess();
        }
      }}>
      <DefaultIcon icon="folder-plus" size={20} />
    </Pressable>
  );
};

export default CreateRoomButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
