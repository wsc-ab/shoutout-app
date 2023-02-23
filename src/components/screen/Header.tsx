import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ContactButton from '../buttons/ContactButton';
import FriendsButton from '../buttons/FriendButton';
import GlobalButton from '../buttons/GlobalButton';
import UserButton from '../buttons/UserButton';

type TProps = {onFriends: () => void; onGlobal: () => void; tab: string};

const Header = ({onFriends, onGlobal, tab}: TProps) => {
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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
    zIndex: 100,
  },
  button: {flex: 1, alignItems: 'center', padding: 10},
  selected: {borderBottomWidth: 1, borderColor: 'white'},
});
