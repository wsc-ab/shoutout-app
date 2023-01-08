import React, {ReactNode} from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {defaultBlack} from '../styles/DefaultColors';
import DefaultAlert from './DefaultAlert';

type TProps = {
  children: ReactNode;
  submitting?: boolean;
};

const DefaultModal = ({children, submitting}: TProps) => {
  return (
    <Modal presentationStyle="pageSheet" animationType="slide">
      <View style={styles.container}>{children}</View>
      {submitting && (
        <DefaultAlert>
          <ActivityIndicator />
        </DefaultAlert>
      )}
    </Modal>
  );
};

export default DefaultModal;

const styles = StyleSheet.create({
  container: {padding: 10, backgroundColor: defaultBlack.lv2, flex: 1},
});
