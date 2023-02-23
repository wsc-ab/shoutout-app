import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ContactButton from '../buttons/ContactButton';
import FriendsButton from '../buttons/FriendButton';
import GlobalButton from '../buttons/GlobalButton';
import UserButton from '../buttons/UserButton';
import {defaultBlack} from '../defaults/DefaultColors';

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
    marginHorizontal: 10,
    position: 'absolute',
    zIndex: 100,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 20,
    marginHorizontal: 10,
    alignSelf: 'stretch',
  },
  selected: {borderBottomWidth: 1, borderColor: 'white'},
});
