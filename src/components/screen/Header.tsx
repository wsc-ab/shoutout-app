import React from 'react';
import {StyleSheet, View} from 'react-native';
import CreateButton from '../buttons/CreateButton';
import FriendsButton from '../buttons/FriendButton';
import GlobalButton from '../buttons/GlobalButton';
import UserButton from '../buttons/UserButton';

type TProps = {onFriends: () => void; onGlobal: () => void};

const Header = ({onFriends, onGlobal}: TProps) => {
  return (
    <View style={styles.container}>
      <UserButton style={styles.button} />
      <FriendsButton style={styles.button} onPress={onFriends} />
      <GlobalButton style={styles.button} onPress={onGlobal} />
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
  button: {flex: 1, alignItems: 'center'},
});
