import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
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
    <View style={[styles.container, style]}>
      <DefaultIcon
        icon="plus"
        onPress={() => onUpdate({target: 'createRoom'})}
        size={20}
        style={styles.icon}
      />
    </View>
  );
};

export default CreateRoomButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 20,
  },
  icon: {
    padding: 10,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 20,
  },
});
