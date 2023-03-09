import React, {ReactNode} from 'react';
import {Modal, Pressable, StyleSheet} from 'react-native';

type TProps = {
  children: ReactNode;
  onCancel: () => void;
};

const DefaultBottomModal = ({children, onCancel}: TProps) => {
  return (
    <Modal transparent>
      <Pressable
        onPress={onCancel}
        style={[styles.background, StyleSheet.absoluteFill]}
      />
      {children}
    </Modal>
  );
};

export default DefaultBottomModal;

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
