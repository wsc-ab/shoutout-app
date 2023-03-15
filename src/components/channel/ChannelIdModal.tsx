import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import {TDocData, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {groupArrayByUser} from '../../utils/Array';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import Moments from '../moment/Moments';

type TProps = {
  channel: {id: string};
  moment?: {id: string};
  onCancel: () => void;
};

const ChannelIdModal = ({channel, moment, onCancel}: TProps) => {
  const [data, setData] = useState<TDocData>();

  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const newData = (
          await firestore().collection('channels').doc(channel.id).get()
        ).data();

        if (newData) {
          const groupedMoments = groupArrayByUser({
            items: newData.moments.items,
          });

          if (moment) {
            const createdById = newData.moments.items.filter(
              ({id: elId}: {id: string}) => elId === moment.id,
            )[0].createdBy.id;

            const userIndex = moment
              ? groupedMoments.findIndex(
                  item => item[0].createdBy.id === createdById,
                )
              : -1;

            groupedMoments.unshift(groupedMoments.splice(userIndex, 1)[0]);
          }

          setData({...newData, groupedMoments});
          setStatus('loaded');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [channel.id, moment, status]);

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
  if (!data) {
    return null;
  }

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
        channel={data}
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
        <DefaultIcon icon="angle-left" style={styles.icon} onPress={onCancel} />
      </SafeAreaView>
      <FlatList
        data={data.groupedMoments}
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

export default ChannelIdModal;

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
