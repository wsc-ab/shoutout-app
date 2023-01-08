import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {getItems} from '../functions/item';
import {TDocData} from '../types/firebase';
import {TStyleView} from '../types/style';
import ContentCard from './ContentCard';
import PassButton from './PassButton';

import ShoutoutButton from './ShoutoutButton';

type TProps = {
  style: TStyleView;
};

const Contents = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);

  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  useEffect(() => {
    const load = async () => {
      try {
        const {items} = await getItems({
          collection: 'contents',
          pagination: {startAfterId: undefined, numberOfItems: 10},
          tags: [],
        });

        setData(items);
        setStatus('loaded');
      } catch (error) {
        Alert.alert('Please retry', 'Failed to load contents');
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  const [index, setIndex] = useState(0);

  const onPass = async () => {
    if (index === data.length - 1) {
      setStatus('loading');
      return setIndex(0);
    }

    setIndex(pre => {
      const newIndex = (pre + 1) % data.length;

      return newIndex;
    });
  };

  if (status === 'loading') {
    return <ActivityIndicator style={styles.noData} />;
  }

  if (status === 'error') {
    return (
      <DefaultText
        title="Error. Please retry."
        style={styles.noData}
        onPress={() => setStatus('loading')}
      />
    );
  }

  if (data.length === 0) {
    return (
      <DefaultText
        title="No item to check at the moment. Comeback later!"
        style={styles.noData}
      />
    );
  }

  return (
    <View style={style}>
      <ContentCard content={data[index]} style={styles.card} />
      <View style={styles.nav}>
        <PassButton onSuccess={onPass} id={data[index].id} />
        <ShoutoutButton collection="contents" id={data[index].id} />
      </View>
    </View>
  );
};

export default Contents;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    bottom: 0,
  },
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
