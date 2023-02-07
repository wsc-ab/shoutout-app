import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style: TStyleView;
};

const UserButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <View style={style}>
      <DefaultIcon
        icon="user"
        size={20}
        onPress={() => {
          onUpdate({target: 'auth'});
        }}
        style={styles.icon}
      />
    </View>
  );
};

export default UserButton;

const styles = StyleSheet.create({icon: {alignItems: 'flex-start'}});
