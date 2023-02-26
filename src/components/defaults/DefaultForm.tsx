import {IconProp} from '@fortawesome/fontawesome-svg-core';
import React, {ReactNode} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from './DefaultIcon';

import DefaultText from './DefaultText';

type TProps = {
  title: string;
  left?: {onPress: () => void};
  right?: {
    icon?: IconProp;
    onPress?: () => void;
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
          {left && (
            <DefaultIcon
              icon="angle-left"
              onPress={left.onPress}
              size={20}
              style={styles.icon}
            />
          )}
        </View>
        <DefaultText
          title={title}
          style={styles.center}
          textStyle={styles.centerText}
        />
        <View style={styles.right}>
          {right && !right.submitting && right.onPress && (
            <DefaultIcon
              icon={right.icon ?? 'angle-right'}
              onPress={right.onPress}
              size={20}
              style={styles.icon}
            />
          )}

          {right?.submitting && <ActivityIndicator style={styles.act} />}
        </View>
      </View>
      {children}
    </View>
  );
};

export default DefaultForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 40,
    paddingBottom: 50,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  icon: {padding: 10},
  left: {alignItems: 'flex-start'},
  center: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  centerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  right: {alignItems: 'flex-end'},
  act: {padding: 10},
});
