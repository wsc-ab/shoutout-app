import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Moments from './Moments';

import AuthUserContext from '../../contexts/AuthUser';
import {addLog} from '../../functions/Log';
import Permission from '../notification/Permission';
import Header from './Header';
import Landing from './Landing';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, loaded} = useContext(AuthUserContext);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    const isWelcomeViewed = authUserData?.logs?.some(
      ({name}: {name: string}) => name === 'viewedWelcome',
    );

    setWelcome(pre => (pre ? isWelcomeViewed : false));
  }, [authUserData?.logs]);

  if (!loaded) {
    return null;
  }

  if (!authUserData) {
    return <Landing style={styles.container} />;
  }

  const onWelcomeDone = async () => {
    setWelcome(false);

    await addLog({
      id: authUserData.id,
      collection: 'users',
      log: {name: 'viewedWelcome', detail: 'user viewed the welcome screen'},
    });
  };

  if (welcome) {
    return <Welcome onDone={onWelcomeDone} />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <Moments style={styles.moments} />
      <Permission />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1},
  moments: {flex: 1},
});
