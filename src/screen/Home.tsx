import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Contents from '../components/Contents';
import Header from '../components/Header';
import SignUpModal from '../components/SignUpModal';
import Welcome from '../components/Welcome';
import AuthUserContext from '../contexts/AuthUser';

const Home = () => {
  const {authUser, authUserData, loaded} = useContext(AuthUserContext);

  const [signedUp, setSignedUp] = useState<boolean>();

  useEffect(() => {
    if (loaded && authUser && !authUserData) {
      setTimeout(() => {
        setSignedUp(false);
      }, 1);
    }

    if (loaded && authUser && authUserData) {
      setSignedUp(true);
    }
  }, [authUser, authUserData, loaded]);

  if (!loaded) {
    return null;
  }

  if (!authUser) {
    return <Welcome style={styles.container} />;
  }

  if (signedUp === undefined) {
    return null;
  }

  if (signedUp === false) {
    return (
      <View>
        <SignUpModal uid={authUser.uid} onSuccess={() => setSignedUp(true)} />
      </View>
    );
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
