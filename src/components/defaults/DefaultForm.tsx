import {IconProp} from '@fortawesome/fontawesome-svg-core';
import React, {ReactNode} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
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
      <SafeAreaView style={styles.header}>
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

          {right?.submitting && <ActivityIndicator style={styles.icon} />}
          {!right && <View style={styles.icon} />}
        </View>
      </SafeAreaView>
      <View style={{flex: 1, marginHorizontal: 20}}>{children}</View>
    </View>
  );
};

export default DefaultForm;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    zIndex: 100,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
  },
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
});
