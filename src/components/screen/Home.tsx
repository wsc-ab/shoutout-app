import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, View} from 'react-native';
import Moments from './Moments';

import notifee from '@notifee/react-native';
import AuthUserContext from '../../contexts/AuthUser';
import Permission from '../notification/Permission';
import Channels from './Channels';
import Header from './Header';
import Landing from './Landing';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, loaded} = useContext(AuthUserContext);

  const [tab, setTab] = useState<'channels' | 'globe'>('channels');

  const appState = useRef(AppState.currentState);

  // [START] set badge count to 0 when app becomes active

  useEffect(() => {
    if (authUserData) {
      const load = async () => await notifee.setBadgeCount(0);
      const subscription = AppState.addEventListener(
        'change',
        async nextAppState => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            await load();
          }

          appState.current = nextAppState;
        },
      );

      return () => {
        subscription.remove();
      };
    }
  });

  if (!loaded) {
    return null;
  }

  if (!authUserData) {
    return <Landing style={styles.container} />;
  }

  const isWelcomeViewed = authUserData?.logs?.some(
    ({name}: {name: string}) => name === 'viewedWelcome',
  );

  if (!isWelcomeViewed) {
    return <Welcome />;
  }

  return (
    <View style={styles.container}>
      <Permission />
      <Header
        onChannels={() => setTab('channels')}
        onGlobal={() => setTab('globe')}
        tab={tab}
      />
      <Channels style={[styles.channels, tab !== 'channels' && styles.hide]} />
      <View style={[styles.parent, tab !== 'globe' && styles.hide]}>
        <Moments style={styles.moments} mount={tab === 'globe'} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1},
  channels: {flex: 1},
  parent: {flex: 1},
  moments: {flex: 1},
  hide: {display: 'none'},
});
