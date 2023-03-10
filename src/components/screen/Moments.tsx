import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
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
  const [data, setData] = useState<{id: string}[]>([]);

  const [status, setStatus] = useState<TStatus>('loading');

  const {height, width} = useWindowDimensions();
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
        viewabilityConfig: {
          itemVisiblePercentThreshold: 100,
        },
      },
    ],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const {moments} = await getMoments({pagination: {number: 10}});

        setData(moments);
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
  }, [status]);

  useEffect(() => {
    const load = async () => {
      try {
        const {moments} = await getMoments({pagination: {number: 10}});

        setData(pre => {
          const copy = [...pre];
          return [...copy, ...moments];
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

    if (status === 'loadMore') {
      load();
    }
  }, [status]);

  if (status === 'error') {
    return (
      <View style={[styles.noData, style]}>
        <DefaultText title="Error. Please retry." />
        <DefaultText
          title="Reload"
          onPress={() => setStatus('loading')}
          style={styles.refresh}
        />
      </View>
    );
  }

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: {id: string};
    index: number;
  }) => {
    if (index - 3 >= elIndex || index + 3 <= elIndex) {
      return <View style={{height, width}} />;
    }

    return (
      <View style={{height, width}}>
        <MomentCard
          moments={[item]}
          mount={index - 1 <= elIndex && elIndex <= index + 1}
          inView={index === elIndex}
        />
      </View>
    );
  };

  const onEndReached = () => {
    if (data.length >= 50) {
      setData([]);
      setStatus('loading');
    } else {
      setStatus('loadMore');
    }
  };

  const keyExtractor = (item: TDocData, elIndex: number) => item.id + elIndex;

  return (
    <FlatList
      data={data}
      style={style}
      initialNumToRender={1}
      windowSize={3}
      maxToRenderPerBatch={1}
      snapToInterval={height}
      snapToAlignment={'start'}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      keyExtractor={keyExtractor}
      onEndReachedThreshold={5}
      refreshControl={
        <RefreshControl
          refreshing={status === 'loading'}
          onRefresh={() => {
            setData([]);
            setStatus('loading');
          }}
          tintColor={'gray'}
          style={{flex: 1}}
          progressViewOffset={80}
        />
      }
      disableIntervalMomentum
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      onEndReached={onEndReached}
      renderItem={renderItem}
    />
  );
};

export default Moments;

const styles = StyleSheet.create({
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
