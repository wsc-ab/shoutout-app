import React from 'react';
import {StyleSheet, View} from 'react-native';
import ContactButton from '../buttons/ContactButton';
import FriendsButton from '../buttons/FriendButton';
import GlobalButton from '../buttons/GlobalButton';
import UserButton from '../buttons/UserButton';

type TProps = {onFriends: () => void; onGlobal: () => void; tab: string};

const Header = ({onFriends, onGlobal, tab}: TProps) => {
  return (
    <View style={styles.container}>
      <UserButton style={styles.button} />
      <FriendsButton
        style={[styles.button, tab === 'friends' && styles.selected]}
        onPress={onFriends}
      />
      <GlobalButton
        style={[styles.button, tab === 'globe' && styles.selected]}
        onPress={onGlobal}
      />
      <ContactButton style={styles.button} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    position: 'absolute',
    top: 40,
    zIndex: 100,
  },
  button: {flex: 1, alignItems: 'center'},
  selected: {borderBottomWidth: 1, borderColor: 'white'},
});
