import React, {ReactNode} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';

type TProps = {
  children: ReactNode;
  style?: TStyleView;
  onCancel: () => void;
};

const DefaultBottomModal = ({children, style, onCancel}: TProps) => {
  return (
    <Modal transparent>
      <Pressable
        onPress={onCancel}
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      />
      <View style={[styles.container, style]}>{children}</View>
    </Modal>
  );
};

export default DefaultBottomModal;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
});
