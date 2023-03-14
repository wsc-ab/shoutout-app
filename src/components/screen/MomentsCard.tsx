import React, { useRef, useState } from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken
} from 'react-native';

import { TTimestamp } from '../../types/Firebase';
import { TStyleView } from '../../types/Style';

import MomentTestCard from './MomentCard';

type TProps = {
  moments: {
    id: string;
    name: string;
    content: {path: string};
    createdBy: {id: string; displayName: string};
  }[];
  style?: TStyleView;
  mount: boolean;
  momentIndex?: number;
  pauseOnModal?: boolean;
  inView: boolean;
  blur?: boolean;
  firstUploadDate: TTimestamp;
  channel?: {id: string};
};

const MomentsCard = ({
  moments,
  style,
  momentIndex,
  pauseOnModal,
  firstUploadDate,
  mount,
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

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: {
      id: string;
      content: {path: string; mode: 'camera'; media: 'image' | 'video'};
      addedAt: TTimestamp;
      name: string;
      createdBy: {id: string};
    };
    index: number;
  }) => {
    return (
      <MomentTestCard
        moment={item}
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
        initialScrollIndex={momentIndex}
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

export default MomentsCard;
