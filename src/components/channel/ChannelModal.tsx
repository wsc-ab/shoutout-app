import React, {useContext, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';

import ModalContext from '../../contexts/Modal';
import {TDocData, TTimestamp} from '../../types/Firebase';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import Moments from '../moment/Moments';

type TProps = {
  channel: TDocData;
  moment?: {id: string};
};

const ChannelModal = ({channel, moment}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
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
    item: {id: string; addedAt: TTimestamp}[];
    index: number;
  }) => {
    if (index - 3 >= elIndex || index + 3 <= elIndex) {
      return <View style={{height, width}} />;
    }

    const initialScrollIndex = moment
      ? item.findIndex(({id: elId}) => elId === moment.id)
      : 0;

    return (
      <Moments
        moments={item}
        channel={channel}
        initialScrollIndex={initialScrollIndex}
        mount={index - 1 <= elIndex && elIndex <= index + 1}
        inView={index === elIndex}
        style={{
          height,
          width,
        }}
      />
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
    <DefaultModal>
      <SafeAreaView style={styles.view}>
        <DefaultIcon
          icon="angle-left"
          style={styles.icon}
          onPress={() => {
            onUpdate(undefined);
          }}
        />
      </SafeAreaView>

      <FlatList
        removeClippedSubviews={false}
        nestedScrollEnabled
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
        style={StyleSheet.absoluteFill}
      />
    </DefaultModal>
  );
};

export default ChannelModal;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    zIndex: 100,
  },
  icon: {padding: 10},
});
