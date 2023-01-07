import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import ContentCard from './ContentCard';
import {getItems} from './functions/item';
import ShoutoutButton from './ShoutoutButton';
import {TDocData} from './types/firebase';
import {TStyleView} from './types/style';

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

  const onPass = () => setIndex(pre => (pre + 1) % data.length);

  if (data.length === 0) {
    return (
      <Pressable>
        <Text>Refresh</Text>
      </Pressable>
    );
  }

  return (
    <View style={style}>
      <ContentCard content={data[index]} style={styles.card} />
      <View style={styles.nav}>
        <Pressable onPress={onPass}>
          <Text>Pass</Text>
        </Pressable>
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
});
