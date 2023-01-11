import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import Contents from './Contents';

import AuthUserContext from '../../contexts/AuthUser';
import DefaultText from '../defaults/DefaultText';
import Header from './Header';
import Welcome from './Welcome';

const Home = () => {
  const {authUser, content, loaded} = useContext(AuthUserContext);

  if (!loaded) {
    return null;
  }

  if (!authUser) {
    return <Welcome style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Header />
      {content && <Contents style={styles.contents} />}
      {!content && (
        <DefaultText
          title="Please add a content to cast your shoutouts"
          style={styles.upload}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {padding: 20, flex: 1},
  contents: {flex: 1},
  upload: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
