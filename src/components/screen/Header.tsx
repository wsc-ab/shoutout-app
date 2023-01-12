import React from 'react';
import {StyleSheet, View} from 'react-native';
import CreateButton from '../buttons/CreateButton';
import RankingButton from '../buttons/RankingButton';
import UserButton from '../buttons/UserButton';

type TProps = {
  onModal: (visible: boolean) => void;
};

const Header = ({onModal}: TProps) => {
  return (
    <View style={styles.container}>
      <UserButton style={styles.button} onModal={onModal} />
      <RankingButton style={styles.button} onModal={onModal} />
      <CreateButton style={styles.button} onModal={onModal} />
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
    top: 40,
    zIndex: 100,
  },
  button: {flex: 1},
});
