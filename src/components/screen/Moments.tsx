import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {getMoments} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import MomentCard from './MomentCard';

type TProps = {
  style: TStyleView;
};

const Moments = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);

  const [status, setStatus] = useState<TStatus>('loading');
  const {modal} = useContext(ModalContext);
  const {height} = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems && viewableItems.length > 0) {
      setIndex(viewableItems[0].index ?? 0);
    }
  };

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>(
    [
      {
        onViewableItemsChanged,
        viewabilityConfig: {itemVisiblePercentThreshold: 100},
      },
    ],
  );

  useEffect(() => {
    const load = async () => {
      try {
        if (status === 'loading') {
          setData([]);
        }
        const {moments} = await getMoments({pagination: {number: 10}});

        setData(pre => {
          const copy = [...pre];
          if (status === 'loadMore') {
            copy.splice(0, Math.floor(pre.length / 2) - 1);
            return [...copy, ...moments];
          }
          return moments;
        });

        setStatus('loaded');
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });

        setStatus('error');
      }
    };

    if (status === 'loading' || status === 'loadMore') {
      load();
    }
  }, [status]);

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

  if (status === 'loaded' && data.length === 0) {
    return (
      <View style={styles.noData}>
        <DefaultText title="No moment found." />
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
      <FlatList
        data={data}
        initialNumToRender={1}
        snapToInterval={height}
        snapToAlignment={'start'}
        decelerationRate="fast"
        keyExtractor={(item, elIndex) => item.id + elIndex}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => setStatus('loading')}
            tintColor={'gray'}
            progressViewOffset={80}
          />
        }
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onEndReached={() => setStatus('loadMore')}
        renderItem={({item, index: elIndex}) => {
          return (
            <MomentCard
              moment={item}
              style={styles.card}
              inView={modal ? false : elIndex === index}
            />
          );
        }}
      />
    </View>
  );
};

export default Moments;

const styles = StyleSheet.create({
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
