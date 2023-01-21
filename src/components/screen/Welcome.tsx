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
        <DefaultText title="Make people laugh" textStyle={styles.sloganText} />
        <View style={styles.steps}>
          <DefaultText title="One shot, One opportunity, Everyday" />
        </View>
        <DefaultText
          title="Enter"
          onPress={() => setModal('enter')}
          textStyle={styles.enterText}
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
  enter: {
    marginTop: 50,
  },
  enterText: {fontSize: 20, fontWeight: 'bold'},
});
