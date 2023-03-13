import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import FriendsButton from '../buttons/ChannelsButton';
import GlobalButton from '../buttons/GlobalButton';
import SearchButton from '../buttons/SearchButton';
import UserButton from '../buttons/UserButton';

type TProps = {onChannels: () => void; onGlobal: () => void; tab: string};

const Header = ({onChannels, onGlobal, tab}: TProps) => {
  const position = tab === 'channels' ? 'relative' : 'absolute';
  return (
    <SafeAreaView style={[styles.container, {position}]}>
      <UserButton style={styles.button} />
      <FriendsButton
        style={[styles.button]}
        color={tab === 'channels' ? 'white' : 'gray'}
        onPress={onChannels}
      />
      {/* <GlobalButton
        style={[styles.button]}
        color={tab === 'globe' ? 'white' : 'gray'}
        onPress={onGlobal}
      /> */}
      <SearchButton style={styles.button} />
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
