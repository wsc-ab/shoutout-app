import React from 'react';
import {StyleSheet, View} from 'react-native';
import CreateButton from '../buttons/CreateButton';
import RankingButton from '../buttons/RankingButton';
import UserButton from '../buttons/UserButton';

const Header = () => {
  return (
    <View style={styles.container}>
      <UserButton style={styles.button} />
      <RankingButton style={styles.button} />
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
  },
  button: {flex: 1},
});
