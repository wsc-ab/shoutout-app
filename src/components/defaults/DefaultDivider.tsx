import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';

type TProps = {
  style?: TStyleView;
};

const DefaultDivider = ({style}: TProps) => {
  return <View style={[styles.container, style]} />;
};

export default DefaultDivider;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 20,
  },
});
