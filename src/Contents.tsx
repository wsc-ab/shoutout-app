import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import ContentCard from './ContentCard';
import {getItems} from './functions/item';
import {TDocData} from './types/firebase';

const Contents = () => {
  const [data, setData] = useState<TDocData[]>([]);

  console.log(data, 'data');

  useEffect(() => {
    const load = async () => {
      try {
        const {items} = await getItems({
          collection: 'contents',
          pagination: {startAfterId: undefined, numberOfItems: 10},
          tags: [],
        });

        setData(items);
      } catch (error) {
        Alert.alert('Please retry', 'Failed to load contents');
      }
    };

    load();
  }, []);

  const [index, setIndex] = useState(0);

  const onNext = () => setIndex(pre => (pre + 1) % data.length);

  return (
    <View style={{flex: 1}}>
      {data[index]?.path && <ContentCard content={data[index]} />}
      <View style={styles.nav}>
        <Pressable onPress={onNext}>
          <Text>Next</Text>
        </Pressable>
        <Pressable>
          <Text>Shoutout</Text>
        </Pressable>
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
  },
});
