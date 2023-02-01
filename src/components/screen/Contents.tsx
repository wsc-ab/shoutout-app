import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {getContents} from '../../functions/Content';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
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
  const [pagination, setPagination] = useState<{
    isLast: boolean;
    startAfterId?: string;
  }>({
    isLast: true,
    startAfterId: undefined,
  });
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const load = async () => {
      try {
        const {contents, pagination: newPagination} = await getContents({
          pagination: {
            startAfterId: pagination?.startAfterId ?? undefined,
          },
        });

        setData(contents);
        setStatus('loaded');
        setPagination(newPagination);

        setIndex(0);
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
  }, [authUserData.id, pagination, status]);

  const onNext = () => {
    if (index === data.length - 1) {
      setPagination({isLast: true, startAfterId: undefined});
      return setStatus('loading');
    }

    setIndex(pre => pre + 1);
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

  return (
    <View style={style}>
      {data[index] && (
        <ContentCard
          content={data[index]}
          style={styles.card}
          contentStyle={{height, width}}
          modalVisible={modalVisible}
          onNext={onNext}
          showNav={true}
        />
      )}
    </View>
  );
};

export default Contents;

const styles = StyleSheet.create({
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
