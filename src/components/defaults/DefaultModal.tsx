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
    <Modal presentationStyle="pageSheet" animationType="slide">
      <View style={[styles.container, style]}>{children}</View>
    </Modal>
  );
};

export default DefaultModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultBlack.lv2,
    paddingHorizontal: 10,
    flex: 1,
  },
});
