import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
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
    <View style={[styles.container, style]}>
      <DefaultText title="New room" textStyle={styles.titleText} />
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
