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
import {TDocData} from '../../types/Firebase';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import MomentCard from '../screen/MomentCard';

type TProps = {
  moments: {id: string; contents: {path: string; user: {id: string}}[]}[];
  momentIndex?: number;
  contentPath?: string;
};

const MomentsModal = ({moments, momentIndex = 0, contentPath}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const {onUpdate} = useContext(ModalContext);

  const keyExtractor = (item: TDocData, elIndex: number) => item.id + elIndex;

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
    item: {id: string; contents: {path: string; user: {id: string}}[]};
    index: number;
  }) => {
    if (index - 3 >= elIndex || index + 3 <= elIndex) {
      return <View style={{height, width}} />;
    }

    return (
      <View style={{height, width}}>
        <MomentCard
          moment={{...item}}
          mount={index - 1 <= elIndex && elIndex <= index + 1}
          path={elIndex === momentIndex ? contentPath : undefined}
          pauseOnModal={false}
          inView={index === elIndex}
        />
      </View>
    );
  };

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: height,
    offset: height * itemIndex,
    index: itemIndex,
  });

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
        data={moments}
        style={styles.card}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        snapToInterval={height}
        getItemLayout={getItemLayout}
        initialScrollIndex={momentIndex}
        snapToAlignment={'start'}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyExtractor={keyExtractor}
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={renderItem}
      />
    </DefaultModal>
  );
};

export default MomentsModal;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    zIndex: 100,
  },
  icon: {padding: 10},
  card: {flex: 1, position: 'absolute'},
});
