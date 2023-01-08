import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import Contents from '../components/Contents';
import Header from '../components/Header';
import Welcome from '../components/Welcome';
import AuthUserContext from '../contexts/AuthUser';

const Home = () => {
  const {authUserData} = useContext(AuthUserContext);

  if (!authUserData) {
    return <Welcome style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <Contents style={styles.contents} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {padding: 20, flex: 1},
  contents: {flex: 1},
});
