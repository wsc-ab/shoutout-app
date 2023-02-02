import React from 'react';
import {StyleSheet, View} from 'react-native';
import CreateButton from '../buttons/CreateButton';
import UserButton from '../buttons/UserButton';

type TProps = {
  changeModalVisible: (visible: boolean) => void;
};

const Header = ({changeModalVisible}: TProps) => {
  return (
    <View style={styles.container}>
      <UserButton
        style={styles.button}
        changeModalVisible={changeModalVisible}
      />
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
