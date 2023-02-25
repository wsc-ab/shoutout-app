import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  style?: TStyleView;
};

const CreateRoomButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => onUpdate({target: 'createRoom'})}>
      <DefaultText title="Room" textStyle={styles.titleText} />
      <DefaultIcon icon="plus" size={20} style={styles.icon} />
    </Pressable>
  );
};

export default CreateRoomButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 20,
  },
  titleText: {fontWeight: 'bold'},
  icon: {
    padding: 10,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 20,
  },
});
