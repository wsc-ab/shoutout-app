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

type TProps = {style?: TStyleView};

const Welcome = ({style}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [submitting, setSubmitting] = useState(false);
  const {authUserData} = useContext(AuthUserContext);

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

  const data = [
    {
      title: ['Welcome to Shoutout!'],
    },
    {
      title: ['To view your channels!'],
      detail: 'Go to',
      icon: 'folder',
    },
    {
      title: ['To share moments!'],
      detail: 'Press',
      icon: 'square-plus',
    },
    {
      title: ['To view trending moments!'],
      detail: 'Go to',
      icon: 'globe',
    },
    {
      title: ['To watch connected moments'],
      detail: 'Swipe',
      icon: 'hand-point-left',
    },
    {
      title: ['To watch the next moment'],
      detail: 'Swipe',
      icon: 'hand-point-up',
    },
    {
      title: ["Let's go!"],
      icon: 'face-smile',
      onPress: onDone,
    },
  ];
  return (
    <View style={style}>
      <FlatList
        data={data}
        horizontal
        snapToInterval={width}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        renderItem={({item, index}) => {
          const isLast = index === data.length - 1;
          return (
            <View style={[styles.card, {width, height}]}>
              <View style={styles.detail}>
                {item.detail && <DefaultText title={item.detail} />}
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
                  onPress={item.onPress}
                />
              ))}

              {!isLast && (
                <DefaultText
                  title={`${index + 1}/${data.length}`}
                  style={styles.button}
                />
              )}

              {isLast && !submitting && (
                <DefaultText
                  title={'GO'}
                  style={styles.button}
                  onPress={item.onPress}
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
