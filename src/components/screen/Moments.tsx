import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import {getMoments} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import MomentCard from './MomentCard';

type TProps = {
  style: TStyleView;
  modalVisible: boolean;
  changeModalVisible: (visible: boolean) => void;
};

const Moments = ({style, changeModalVisible}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);

  const [status, setStatus] = useState<TStatus>('loading');

  const {height} = useWindowDimensions();
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

  useEffect(() => {
    const load = async () => {
      try {
        const {moments} = await getMoments({pagination: {number: 10}});

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
  }, [status]);

  if (status === 'loading') {
    return <ActivityIndicator style={styles.noData} />;
  }

  if (status === 'error' || data.length === 0) {
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

  return (
    <View style={style}>
      <FlatList
        data={data}
        initialNumToRender={1}
        snapToInterval={height}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index: elIndex}) => {
          return (
            <MomentCard
              moment={item}
              style={styles.card}
              changeModalVisible={changeModalVisible}
              inView={elIndex === index}
            />
          );
        }}
      />
    </View>
  );
};

export default Moments;

const styles = StyleSheet.create({
  card: {flex: 1},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
