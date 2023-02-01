import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Contents from './Moments';

import AuthUserContext from '../../contexts/AuthUser';
import Header from './Header';
import Welcome from './Welcome';

const Home = () => {
  const {authUserData, loaded} = useContext(AuthUserContext);
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
      <Contents style={styles.contents} modalVisible={modalVisible} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1},
  contents: {flex: 1},
});
