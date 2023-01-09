import React, {ReactNode} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {defaultBlack} from '../styles/DefaultColors';

type TProps = {
  children: ReactNode;
};

const DefaultModal = ({children}: TProps) => {
  return (
    <Modal presentationStyle="pageSheet" animationType="slide">
      <View style={styles.container}>{children}</View>
    </Modal>
  );
};

export default DefaultModal;

const styles = StyleSheet.create({
  container: {padding: 10, backgroundColor: defaultBlack.lv2, flex: 1},
});
