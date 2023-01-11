import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';
import EnterModal from '../modals/EnterModal';

type TProps = {style?: TStyleView};

const Welcome = ({style}: TProps) => {
  const [modal, setModal] = useState<'enter'>();
  return (
    <View style={style}>
      <View style={styles.texts}>
        <DefaultText title="Shoutout" textStyle={styles.title} />
        <DefaultText
          title="Best content wins"
          style={styles.slogan}
          textStyle={styles.sloganText}
        />
        <View style={styles.steps}>
          <DefaultText
            title="1. One shoutout per day, without followers"
            style={styles.step}
          />
          <DefaultText
            title="2. Send shoutouts, without knowing creators"
            style={styles.step}
          />
          <DefaultText
            title="3. Check content rankings, now findout creators"
            style={styles.step}
          />
          <DefaultText
            title="4. Rankings are posted on our social profiles for free"
            style={styles.step}
          />
        </View>
      </View>
      <DefaultText
        title="Enter"
        onPress={() => setModal('enter')}
        style={styles.enter}
      />
      {modal === 'enter' && <EnterModal onCancel={() => setModal(undefined)} />}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  texts: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 50, fontWeight: 'bold'},
  slogan: {marginTop: 10},
  sloganText: {fontSize: 20},
  steps: {marginTop: 30},
  step: {marginTop: 10},
  enter: {
    alignItems: 'center',
    margin: 20,
  },
});
