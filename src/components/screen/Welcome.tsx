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
        <DefaultText title="Best content wins" textStyle={styles.sloganText} />
        <View style={styles.steps}>
          <DefaultText title="One shot, One opportunity, Everyday" />
          <DefaultText
            title="Only contents matter, not followers"
            style={styles.step}
          />
          <DefaultText
            title="Top contents are shared online for free"
            style={styles.step}
          />
        </View>
        <DefaultText
          title="Enter"
          onPress={() => setModal('enter')}
          textStyle={{fontSize: 20, fontWeight: 'bold'}}
          style={styles.enter}
        />
      </View>

      {modal === 'enter' && <EnterModal onCancel={() => setModal(undefined)} />}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  texts: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 50, fontWeight: 'bold'},
  sloganText: {fontSize: 20},
  steps: {marginTop: 50, alignItems: 'center'},
  step: {marginTop: 10},
  enter: {
    marginTop: 50,
  },
});
