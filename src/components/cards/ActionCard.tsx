import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  name: string;
  detail: string;
  onPress?: () => void;
  style?: TStyleView;
};

const ActionCard = ({name, detail, onPress, style}: TProps) => {
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}>
      <DefaultText title={name} textStyle={styles.textName} />
      <DefaultText title={detail} style={styles.detail} />
    </Pressable>
  );
};

export default ActionCard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  textName: {fontWeight: 'bold'},
  detail: {marginTop: 5},
});
