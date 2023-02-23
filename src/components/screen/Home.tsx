import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Moments from './Moments';

import AuthUserContext from '../../contexts/AuthUser';
import Permission from '../notification/Permission';
import Header from './Header';
import Landing from './Landing';
import Prompts from './Prompts';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, loaded} = useContext(AuthUserContext);

  const [tab, setTab] = useState<'friends' | 'globe'>('friends');

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
