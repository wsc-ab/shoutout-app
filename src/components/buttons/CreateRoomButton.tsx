import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
};

const CreateRoomButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => onUpdate({target: 'createRoom'})}>
      <DefaultIcon icon="folder-plus" size={20} />
    </Pressable>
  );
};

export default CreateRoomButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 20,
  },
});
