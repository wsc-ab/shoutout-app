import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {TStyleView} from '../types/style';

import SignIn from './SignInModal';

type TProps = {style?: TStyleView};

const Welcome = ({style}: TProps) => {
  const [modal, setModal] = useState<'enter'>();
  return (
    <View style={style}>
      <View style={styles.texts}>
        <DefaultText title="Shoutout" textStyle={styles.title} />

        <DefaultText
          title="No follower or views, Only Contents"
          style={styles.slogan}
        />

        <View style={styles.steps}>
          <DefaultText
            title="1. Everyone uploads only one content per day"
            style={styles.step}
          />
          <DefaultText
            title="2. Get and send shoutouts to the best contents"
            style={styles.step}
          />
          <DefaultText
            title="3. Check daily, weekly, monthly, yearly rankings"
            style={styles.step}
          />
        </View>
      </View>
      <DefaultText
        title="Enter"
        onPress={() => setModal('enter')}
        style={styles.enter}
      />
      {modal === 'enter' && <SignIn onCancel={() => setModal(undefined)} />}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  texts: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 50, fontWeight: 'bold'},
  slogan: {fontSize: 20},
  steps: {marginTop: 30},
  step: {marginTop: 10},
  enter: {
    alignItems: 'center',
    margin: 20,
  },
});
