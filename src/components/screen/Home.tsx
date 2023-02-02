import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import Moments from './Moments';

import AuthUserContext from '../../contexts/AuthUser';
import Header from './Header';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, loaded} = useContext(AuthUserContext);

  if (!loaded) {
    return null;
  }

  if (!authUserData) {
    return <Welcome style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <Moments style={styles.moments} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1},
  moments: {flex: 1},
});
