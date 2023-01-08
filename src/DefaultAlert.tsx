import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

type TProps = {
  children: ReactNode;
};

const DefaultAlert = ({children}: TProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

export default DefaultAlert;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    borderRadius: 10,
    elevation: 1,
    shadowOpacity: 0.1,
    minWidth: 200,
    minHeight: 200,
  },
});
