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
import AuthUserContext from '../../contexts/AuthUser';
import {getMoments} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import CreateMomentButton from '../buttons/CreateMomentButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import MomentCard from './MomentCard';

type TProps = {
  style: TStyleView;
  mount: boolean;
};

const Moments = ({style, mount}: TProps) => {
  const [data, setData] = useState<{id: string}[]>([]);

  const [status, setStatus] = useState<TStatus>('loading');
  const {authUserData} = useContext(AuthUserContext);
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
        const {moments} = await getMoments({pagination: {number: 5}});

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
  }, [authUserData.contributeTo.items, status]);

  useEffect(() => {
    const load = async () => {
      try {
        const {moments} = await getMoments({pagination: {number: 5}});

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

  const ListEmptyComponent = (
    <>
      {status === 'loaded' ? (
        <View style={styles.noMoment}>
          <DefaultText title="No moment found. Add one!" />
          <CreateMomentButton style={{marginTop: 20}} />
        </View>
      ) : null}
    </>
  );

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: {id: string};
    index: number;
  }) => {
    return (
      <View style={{height, width}}>
        <MomentCard
          moment={{...item}}
          mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
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
    <View style={[style]}>
      <FlatList
        data={data}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        ListEmptyComponent={ListEmptyComponent}
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
            progressViewOffset={100}
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
  noMoment: {
    top: 100,
    alignItems: 'center',
  },
});
