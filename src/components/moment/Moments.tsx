import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
  FlatList,
} from 'react-native';

import {TDocData, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {sortByTimestamp} from '../../utils/Array';
import Moment from './Moment';

type TProps = {
  moments: {
    id: string;
    addedAt: TTimestamp;
  }[];
  initialScrollIndex?: number;
  channel: TDocData;
  mount: boolean;
  inView: boolean;
  style?: TStyleView;
  setEnableScrollView: () => void;
};

const Moments = ({
  moments,
  style,
  initialScrollIndex,
  mount,
  channel,
  inView,
  enableScrollView,
  setEnableScrollView,
}: TProps) => {
  const {width} = useWindowDimensions();

  const ref = useRef<FlatList>(null);

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

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: width,
    offset: width * itemIndex,
    index: itemIndex,
  });

  const firstUploadDate = sortByTimestamp(moments, 'addedAt', 'asc')[0].addedAt;

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: {
      id: string;
    };
    index: number;
  }) => {
    return (
      <Moment
        moment={item}
        channel={channel}
        length={moments.length}
        firstUploadDate={firstUploadDate}
        index={index}
        mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
        inView={inView && index === elIndex}
        style={StyleSheet.absoluteFill}
      />
    );
  };

  return (
    <View style={style}>
      <FlatList
        ref={ref}
        nestedScrollEnabled
        data={moments}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        horizontal
        snapToInterval={width}
        initialScrollIndex={initialScrollIndex}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'start'}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        disableIntervalMomentum
        keyExtractor={item => item.id}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={renderItem}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

export default Moments;
