import {IconProp} from '@fortawesome/fontawesome-svg-core';
import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addLog} from '../../functions/Log';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import {localizations} from './Welcome.localizations';

type TProps = {style?: TStyleView};

const Welcome = ({style}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [submitting, setSubmitting] = useState(false);
  const {authUserData, language} = useContext(AuthUserContext);
  const localization = localizations[language];

  const onDone = async () => {
    setSubmitting(true);

    await addLog({
      id: authUserData.id,
      collection: 'users',
      log: {
        name: 'viewedWelcome',
        detail: 'user viewed the welcome screen',
      },
    });
  };

  return (
    <View style={style}>
      <FlatList
        data={localization.data}
        horizontal
        snapToInterval={width}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        renderItem={({item, index}) => {
          const length = localization.data.length;
          const isLast = index + 1 === length;
          return (
            <View style={[styles.card, {width, height}]}>
              <View style={styles.detail}>
                <DefaultIcon
                  icon={item.icon as IconProp}
                  size={20}
                  style={styles.icon}
                />
              </View>
              {item.title.map(text => (
                <DefaultText
                  key={text}
                  title={text}
                  style={styles.title}
                  textStyle={styles.titleText}
                />
              ))}

              {!isLast && (
                <DefaultText
                  title={`${index + 1}/${length}`}
                  style={styles.button}
                />
              )}

              {isLast && !submitting && (
                <DefaultText
                  title={'GO'}
                  style={styles.button}
                  onPress={onDone}
                  textStyle={{fontWeight: 'bold'}}
                />
              )}
              {isLast && submitting && (
                <ActivityIndicator style={styles.button} />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  detail: {flexDirection: 'row', alignItems: 'center'},
  title: {marginTop: 20},
  titleText: {fontWeight: 'bold'},
  button: {
    bottom: 100,
    position: 'absolute',
  },
  icon: {padding: 10},
});
