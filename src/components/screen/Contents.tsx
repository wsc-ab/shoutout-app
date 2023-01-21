import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {getRank} from '../../functions/Content';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {shuffleArray} from '../../utils/Array';
import {getCurrentDate} from '../../utils/Date';
import NextButton from '../buttons/NextButton';
import ReportButton from '../buttons/ReportButton';
import ShoutoutButton from '../buttons/ShoutoutButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import ContentCard from './ContentCard';

type TProps = {
  style: TStyleView;
  modalVisible: boolean;
};

const Contents = ({style, modalVisible}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);

  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  const {authUserData} = useContext(AuthUserContext);
  const [index, setIndex] = useState(0);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const load = async () => {
      try {
        setIndex(0);
        const {rank} = await getRank({
          date: getCurrentDate().toUTCString(),
        });

        const contentItems = rank?.contents?.items ?? [];

        const shuffledArray = shuffleArray(contentItems);

        setData(shuffledArray);

        setStatus('loaded');
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });

        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [authUserData.id, authUserData.viewed?.contents.ids, status]);

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
        <DefaultText title="Comeback tomorrow!" style={{marginTop: 5}} />
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
        modalVisible={modalVisible}
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
    bottom: 40,
    paddingHorizontal: 20,
  },
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
