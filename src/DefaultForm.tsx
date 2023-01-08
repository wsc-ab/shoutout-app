import React, {ReactNode} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import DefaultText from './DefaultText';

type TProps = {
  title: string;
  left?: {title: string; onPress: () => void};
  right?: {title: string; onPress: () => void};
  children: ReactNode;
};

const DefaultForm = ({title, left, right, children}: TProps) => {
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.left}>
          {left && <Button title={left.title} onPress={left.onPress} />}
        </View>
        <DefaultText title={title} textStyle={styles.centerText} />
        <View style={styles.right}>
          {right && <Button title={right.title} onPress={right.onPress} />}
        </View>
      </View>
      {children}
    </View>
  );
};

export default DefaultForm;

const styles = StyleSheet.create({
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
});
