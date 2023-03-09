import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import LanguageContext from '../../contexts/Language';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';
import EnterModal from '../modals/EnterModal';
import {localizations} from './Landing.localizations';

type TProps = {style?: TStyleView};

const Landing = ({style}: TProps) => {
  const [modal, setModal] = useState<'enter'>();
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  return (
    <View style={style}>
      <View style={styles.texts}>
        <DefaultText title="Shoutout" textStyle={styles.titleText} />
        <DefaultText
          title={localization.detail}
          textStyle={styles.sloganText}
        />
        <DefaultText
          title={localization.enter}
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
  titleText: {fontSize: 50, fontWeight: 'bold'},
  sloganText: {fontSize: 18},
  enter: {
    position: 'absolute',
    bottom: 100,
  },
  enterText: {fontSize: 20, fontWeight: 'bold'},
});
