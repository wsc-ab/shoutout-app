import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  displayName: string;
  thumbnail?: string;
  style?: TStyleView;
};

const SmallUserCard = ({id, displayName, style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      onPress={() => onUpdate({target: 'users', id})}
      style={[styles.container, style]}>
      <DefaultIcon icon="user" style={styles.icon} />
      <DefaultText
        title={displayName}
        style={styles.displayName}
        textStyle={styles.displayNameText}
      />
    </Pressable>
  );
};

export default SmallUserCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    borderRadius: 20,
    flexDirection: 'row',
    backgroundColor: defaultBlack.lv2(1),
    marginRight: 5,
  },
  displayName: {marginBottom: 5},
  displayNameText: {fontWeight: 'bold'},
});
