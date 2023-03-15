import React, {useRef, useState} from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
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
  channel: TDocData;
  mount: boolean;
  pauseOnModal?: boolean;
  inView: boolean;
  style?: TStyleView;
};

const Moments = ({
  moments,
  style,
  pauseOnModal,
  mount,
  channel,
  inView,
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
        pauseOnModal={pauseOnModal}
        firstUploadDate={firstUploadDate}
        index={index}
        mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
        inView={inView && index === elIndex}
      />
    );
  };

  return (
    <View style={style}>
      <FlatList
        ref={ref}
        data={moments}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        horizontal
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'start'}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        disableIntervalMomentum
        keyExtractor={item => {
          return item.id;
        }}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Moments;
