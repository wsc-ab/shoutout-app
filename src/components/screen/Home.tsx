import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Contents from './Contents';

import AuthUserContext from '../../contexts/AuthUser';
import DefaultText from '../defaults/DefaultText';
import Header from './Header';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, content, loaded} = useContext(AuthUserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const onModal = (visible: boolean) => setModalVisible(visible);

  if (!loaded) {
    return null;
  }

  if (!authUserData) {
    return <Welcome style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Header onModal={onModal} />
      {content && (
        <Contents style={styles.contents} modalVisible={modalVisible} />
      )}
      {!content && (
        <DefaultText
          title="Please share a content to cast your shoutouts"
          style={styles.upload}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1},
  contents: {flex: 1},
  upload: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
