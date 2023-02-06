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
      log: {name: 'viewedWelcome', detail: 'user viewed the welcome screen'},
    });
  };

  const data = [
    {
      title: 'To watch connected moments',
      detail: 'Swip',
      icon: 'hand-point-left',
    },
    {
      title: 'To watch the next moment',
      detail: 'Swipe',
      icon: 'hand-point-up',
    },
    {
      title: 'To share a moment',
      detail: 'Press',
      icon: 'plus',
    },
    {
      title: 'To link a moment',
      detail: 'Press',
      icon: 'reply-all',
    },
    {
      title: "Let's go",
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.detail && <DefaultText title={item.detail} />}
                <DefaultIcon icon={item.icon as IconProp} />
              </View>

              <DefaultText
                title={item.title}
                style={{marginTop: 20}}
                textStyle={{fontWeight: 'bold'}}
                onPress={item.onPress}
              />

              {!isLast && (
                <DefaultText
                  title={`${index + 1}/${data.length}`}
                  style={{bottom: 100, position: 'absolute'}}
                />
              )}

              {isLast && !submitting && (
                <DefaultText
                  title={'OK'}
                  style={{bottom: 100, position: 'absolute'}}
                  textStyle={{fontWeight: 'bold'}}
                  onPress={item.onPress}
                />
              )}
              {isLast && submitting && <ActivityIndicator />}
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
});
