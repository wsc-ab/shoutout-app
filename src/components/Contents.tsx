import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {getContents} from '../functions/Content';
import {TDocData} from '../types/firebase';
import {TStyleView} from '../types/style';
import ContentCard from './ContentCard';
import NextButton from './NextButton';
import ReportButton from './ReportButton';

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
        const {items} = await getContents({
          numberOfItems: 10,
        });

        setData(items);
        setStatus('loaded');
        setIndex(0);
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

  const onNext = async () => {
    if (index === data.length - 1) {
      return setStatus('loading');
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
      <View style={styles.noData}>
        <DefaultText title="Error. Please retry." />
        <DefaultText
          title="Reload"
          onPress={() => setStatus('loading')}
          style={styles.refresh}
        />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.noData}>
        <DefaultText title="No item to check. Try refreshing later." />
        <DefaultText
          title="Refresh now"
          onPress={() => setStatus('loading')}
          style={styles.refresh}
        />
      </View>
    );
  }

  return (
    <View style={style}>
      <ContentCard content={data[index]} style={styles.card} />
      <View style={styles.nav}>
        <NextButton onSuccess={onNext} id={data[index].id} style={{flex: 1}} />
        <ShoutoutButton
          collection="contents"
          id={data[index].id}
          style={{flex: 1}}
        />
        <ReportButton
          collection="contents"
          id={data[index].id}
          onSuccess={onNext}
          style={{flex: 1}}
        />
      </View>
    </View>
  );
};

export default Contents;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
