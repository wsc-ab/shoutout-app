import React from 'react';
import {StyleSheet, View} from 'react-native';
import CreateButton from '../buttons/CreateButton';
import UserButton from '../buttons/UserButton';

type TProps = {
  onModal: (visible: boolean) => void;
};

const Header = ({onModal}: TProps) => {
  return (
    <View style={styles.container}>
      <UserButton style={styles.button} onModal={onModal} />
      <CreateButton style={styles.button} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 40,
    zIndex: 100,
  },
  button: {flex: 1},
});
