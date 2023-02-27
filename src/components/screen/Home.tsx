import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, View} from 'react-native';
import Moments from './Moments';

import notifee from '@notifee/react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {ModalProvider} from '../../contexts/Modal';
import {PopupProvider} from '../../contexts/Popup';
import Permission from '../notification/Permission';
import Header from './Header';
import Landing from './Landing';
import Prompts from './Rooms';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, loaded} = useContext(AuthUserContext);

  const [tab, setTab] = useState<'friends' | 'globe'>('friends');

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

  // [END] set badge count to 0 when app becomes active

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
      <ModalProvider>
        <PopupProvider>
          <Header
            onFriends={() => setTab('friends')}
            onGlobal={() => setTab('globe')}
            tab={tab}
          />
          <Prompts style={[styles.prompts, tab !== 'friends' && styles.hide]} />
          <Moments
            style={[styles.moments, tab !== 'globe' && styles.hide]}
            mount={tab === 'globe'}
          />
          <Permission />
        </PopupProvider>
      </ModalProvider>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1},
  prompts: {flex: 1},
  moments: {flex: 1},
  hide: {display: 'none'},
});
