import React, {ReactNode} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from './DefaultIcon';

import DefaultText from './DefaultText';

type TProps = {
  title: string;
  left?: {onPress: () => void};
  right?: {
    onPress: () => void;
    disabled?: boolean;
    submitting?: boolean;
  };
  children: ReactNode;
  style?: TStyleView;
};

const DefaultForm = ({title, left, right, children, style}: TProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.left}>
          {left && <DefaultIcon icon="angle-left" onPress={left.onPress} />}
        </View>
        <DefaultText title={title} textStyle={styles.centerText} />
        <View style={styles.right}>
          {right && !right.submitting && (
            <DefaultIcon icon="angle-right" onPress={right.onPress} />
          )}
          {right?.submitting && <ActivityIndicator style={styles.acitivity} />}
        </View>
      </View>
      {children}
    </View>
  );
};

export default DefaultForm;

const styles = StyleSheet.create({
  container: {flex: 1, paddingBottom: 50},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  left: {flex: 1, alignItems: 'flex-start'},
  centerText: {
    fontSize: 20,
    textAlign: 'center',
  },
  right: {flex: 1, alignItems: 'flex-end'},
  acitivity: {paddingHorizontal: 10},
});