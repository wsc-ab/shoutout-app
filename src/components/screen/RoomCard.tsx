import React, {useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {sentToFirst} from '../../utils/Array';
import DefaultText from '../defaults/DefaultText';
import MomentCard from './MomentCard';

type TProps = {
  style?: TStyleView;
  room: TDocData;
  pauseOnModal?: boolean;
  path?: string;
  mount: boolean;
};

const RoomCard = ({style, room, path, pauseOnModal, mount}: TProps) => {
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
    item: {id: string};
    index: number;
  }) => {
    if (index - 3 >= elIndex || index + 3 <= elIndex) {
      return <View style={{height, width}} />;
    }

    return (
      <View
        style={{
          height,
          width,
        }}>
        <MomentCard
          moment={item}
          mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
          pauseOnModal={pauseOnModal}
          inView={index === elIndex}
          room={{id: room.id}}
        />
      </View>
    );
  };

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: height,
    offset: height * itemIndex,
    index: itemIndex,
  });

  const keyExtractor = (item: TDocData, elIndex: number) => item.id + elIndex;

  const sortMoment = () =>
    path
      ? sentToFirst({array: room.moments.items, field: 'path', value: path})
      : room.moments.items;

  return (
    <View style={style}>
      <FlatList
        data={sortMoment()}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        ListEmptyComponent={ListEmptyComponent}
        snapToInterval={height}
        snapToAlignment={'start'}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={renderItem}
      />
    </View>
  );
};

export default RoomCard;

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
