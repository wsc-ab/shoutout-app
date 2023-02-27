import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ContactButton from '../buttons/ContactButton';
import FriendsButton from '../buttons/FriendButton';
import GlobalButton from '../buttons/GlobalButton';
import UserButton from '../buttons/UserButton';

type TProps = {onFriends: () => void; onGlobal: () => void; tab: string};

const Header = ({onFriends, onGlobal, tab}: TProps) => {
  const position = tab === 'friends' ? 'relative' : 'absolute';
  return (
    <SafeAreaView style={[styles.container, {position}]}>
      <UserButton style={styles.button} />
      <FriendsButton
        style={[styles.button]}
        color={tab === 'friends' ? 'white' : 'gray'}
        onPress={onFriends}
      />
      <GlobalButton
        style={[styles.button]}
        color={tab === 'globe' ? 'white' : 'gray'}
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
    zIndex: 100,
    margin: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
