import React, {ReactNode} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import {defaultBlack} from './DefaultColors';

type TProps = {
  children: ReactNode;
  style?: TStyleView;
};

const DefaultModal = ({children, style}: TProps) => {
  return (
    <Modal
      animationType="slide"
      transparent
      style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
      <View style={[styles.container, style]}>{children}</View>
    </Modal>
  );
};

export default DefaultModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultBlack.lv2(1),
    flex: 1,
  },
});
