import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from './AuthUser';
import Contents from './Contents';
import Header from './Header';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData} = useContext(AuthUserContext);

  if (!authUserData) {
    return <Welcome />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <Contents style={{flex: 1}} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({container: {padding: 20, flex: 1}});
