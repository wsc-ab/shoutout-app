import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import ChannelHeader from './ChannelHeader';
import ChannelMoments from './ChannelMoments';
import ChannelTags from './ChannelTags';

type TProps = {
  channel: {id: string};
  style?: TStyleView;
};

const Channel = ({channel, style}: TProps) => {
  const [data, setData] = useState<TDocData>();
  const {authUserData} = useContext(AuthUserContext);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        return;
      }

      const newChanneld = doc.data();

      if (newChanneld) {
        setData(newChanneld);
      }
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get channel data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('channels')
      .doc(channel.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [authUserData.id, channel.id]);

  if (!data) {
    return null;
  }

  return (
    <View style={style}>
      <ChannelHeader channel={data} />
      <ChannelTags channel={data} style={styles.tags} />
      <ChannelMoments channel={data} style={styles.moments} />
    </View>
  );
};

export default Channel;

const styles = StyleSheet.create({
  tags: {marginTop: 5},
  moments: {marginTop: 5},
});
