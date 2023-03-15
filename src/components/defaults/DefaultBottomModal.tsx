import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {defaultBlack, defaultRed} from './DefaultColors';
import DefaultText from './DefaultText';

type TProps<A extends string> = {
  options: {name: A; title: string; type?: 'default' | 'cancel'}[];
  onPress: (name: A) => void;
  onCancel: () => void;
};

const DefaultBottomModal = <A extends string>({
  options,
  onPress,
  onCancel,
}: TProps<A>) => {
  return (
    <Modal transparent>
      <Pressable
        onPress={onCancel}
        style={[styles.background, StyleSheet.absoluteFill]}
      />
      <View style={styles.container}>
        {options.map(option => (
          <DefaultText
            key={option.name}
            title={option.title}
            style={styles.option}
            onPress={() => onPress(option.name)}
            textStyle={[
              styles.optionText,
              option.type === 'cancel' && styles.cancelText,
            ]}
          />
        ))}
      </View>
    </Modal>
  );
};

export default DefaultBottomModal;

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    paddingBottom: 24,
    marginHorizontal: 10,
  },
  option: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: defaultBlack.lv4(1),
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  optionText: {fontWeight: 'bold'},
  cancelText: {fontWeight: 'bold', color: defaultRed.lv1},
});
