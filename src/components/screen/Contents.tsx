import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {getRanking} from '../../functions/Content';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {shuffleArray} from '../../utils/Array';
import {getCurrentDate} from '../../utils/Date';
import NextButton from '../buttons/NextButton';
import ReportButton from '../buttons/ReportButton';
import ShoutoutButton from '../buttons/ShoutoutButton';
import DefaultText from '../defaults/DefaultText';
import ContentCard from './ContentCard';

type TProps = {
  style: TStyleView;
};

const Contents = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);

  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  const {authUserData} = useContext(AuthUserContext);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const load = async () => {
      try {
        const {ranking} = await getRanking({
          date: getCurrentDate().toUTCString(),
        });

        const contentItems = ranking?.contents?.items ?? [];

        const filteredItems = contentItems.filter(item => {
          const isNotFromUser = !item.contributeFrom?.users?.ids.includes(
            authUserData.id,
          );
          const isNotViewed = !authUserData.viewed?.contents.ids.includes(
            item.id,
          );
          return !isNotFromUser && !isNotViewed;
        });

        const shuffledArray = shuffleArray(contentItems);

        setData(shuffledArray);

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
  }, [authUserData.id, status]);

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
        <DefaultText title="You've viewed all contents for today." />
        <DefaultText
          title="Refresh"
          onPress={() => setStatus('loading')}
          style={styles.refresh}
        />
      </View>
    );
  }

  return (
    <View style={style}>
      <ContentCard
        content={data[index]}
        style={styles.card}
        contentStyle={{height, width}}
      />
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
    bottom: 20,
    paddingHorizontal: 20,
  },
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
