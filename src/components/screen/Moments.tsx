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
import {addItemEveryIndex} from '../../utils/Array';
import {getSecondsGap} from '../../utils/Date';
import CreateButton from '../buttons/CreateButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import MomentCard from './MomentCard';

type TProps = {
  style: TStyleView;
  mount: boolean;
};

const Moments = ({style, mount}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);

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

        let newMoments: TDocData[] = moments;

        const promptToShare = authUserData.contributeTo.items[0]?.addedAt
          ? getSecondsGap({
              date: new Date(),
              timestamp: authUserData.contributeTo.items[0]?.addedAt,
            }) >=
            3 * 24 * 60 * 60
          : true;

        if (promptToShare) {
          newMoments = addItemEveryIndex({
            array: moments,
            index: 10,
            item: {type: 'shareMoment'},
          });
        }

        setData(newMoments);

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
        <DefaultText
          title="No moment found. Please reload."
          style={styles.noMoment}
        />
      ) : null}
    </>
  );

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: TDocData;
    index: number;
  }) => {
    if (item.type === 'shareMoment') {
      return (
        <View
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height,
            width,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: defaultBlack.lv2(1),
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DefaultText
              title={'Share your live moment'}
              textStyle={{fontWeight: 'bold'}}
            />
            <DefaultText
              title={'and connect with others!'}
              textStyle={{fontWeight: 'bold'}}
              style={{marginTop: 5}}
            />
            <CreateButton style={{marginTop: 5}} />
          </View>
        </View>
      );
    }
    return (
      <View style={{height, width}}>
        <MomentCard
          moment={{...item, index: elIndex}}
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

  const keyExtractor = (item: TDocData, elIndex: number) => {
    if (item.type === 'shareMoment') {
      return item.type + elIndex;
    }
    return item.id + elIndex;
  };

  return (
    <View style={style}>
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
