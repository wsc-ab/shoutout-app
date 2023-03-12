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
import {TStyleView} from '../../types/Style';
import MomentCard from './MomentsCard';

type TProps = {
  style?: TStyleView;
  channel: TDocData;
  pauseOnModal?: boolean;
  mount: boolean;
};

const ChannelCard = ({style, channel, pauseOnModal, mount}: TProps) => {
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
          moments={item}
          momentIndex={0}
          mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
          pauseOnModal={pauseOnModal}
          inView={index === elIndex}
          channel={{id: channel.id}}
        />
      </View>
    );
  };

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: height,
    offset: height * itemIndex,
    index: itemIndex,
  });

  const keyExtractor = (item: TDocData, elIndex: number) => {
    return item[0].id + elIndex;
  };

  return (
    <View style={style}>
      <FlatList
        data={channel.groupedMoments}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
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

export default ChannelCard;
