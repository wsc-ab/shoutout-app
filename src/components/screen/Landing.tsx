import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';
import EnterModal from '../modals/EnterModal';

type TProps = {style?: TStyleView};

const Landing = ({style}: TProps) => {
  const [modal, setModal] = useState<'enter'>();
  return (
    <View style={style}>
      <View style={styles.texts}>
        <DefaultText title="bâton" textStyle={styles.titleText} />
        <DefaultText
          title="connect live moments"
          textStyle={styles.sloganText}
        />
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

export default Landing;

const styles = StyleSheet.create({
  texts: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleText: {fontSize: 70, fontWeight: 'bold'},
  sloganText: {fontSize: 20},
  enter: {
    position: 'absolute',
    bottom: 100,
  },
  enterText: {fontSize: 20, fontWeight: 'bold'},
});