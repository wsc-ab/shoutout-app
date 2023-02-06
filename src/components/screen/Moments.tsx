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
            return [...copy, ...moments];
          }
          return moments;
        });

        setStatus('loaded');
      } catch (error) {
        console.log(error, 'e');

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

  console.log(data.length, index, 'data length');

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

  const getItemLayout = (_, itemIndex) => ({
    length: height,
    offset: height * itemIndex,
    index: itemIndex,
  });

  const renderItem = ({item, index: elIndex}) => {
    return (
      <MomentCard moment={item} inView={modal ? false : elIndex === index} />
    );
  };

  const onEndReached = () =>
    setStatus(data.length >= 50 ? 'loading' : 'loadMore');

  const keyExtractor = (item, elIndex) => item.id + elIndex;

  return (
    <View style={style}>
      <FlatList
        data={data.slice(-10)}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        getItemLayout={getItemLayout}
        snapToInterval={height}
        snapToAlignment={'start'}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyExtractor={keyExtractor}
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
        onEndReached={onEndReached}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Moments;

const styles = StyleSheet.create({
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
