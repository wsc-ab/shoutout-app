import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import {getMoment} from '../../functions/Moment';

import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import LikeButton from '../buttons/LikeButton';
import ContributorButton from '../buttons/ContributorButton';
import ReplyButton from '../buttons/ReplyButton';
import ReportButton from '../buttons/ReportButton';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
  inView: boolean;
};

const MomentSummaryCard = ({moment, style, inView}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);
  const {height, width} = useWindowDimensions();

  const [status, setStatus] = useState<TStatus>('loading');
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
      const {moment: newMoment} = await getMoment({
        moment: {id: moment.id},
      });

      setData([newMoment, ...newMoment.linkFrom.items]);
      setStatus('loaded');
    };

    if (status === 'loading') {
      load();
    }
  }, [moment.id, status]);

  return (
    <View style={style}>
      <FlatList
        data={data}
        initialNumToRender={1}
        horizontal
        snapToInterval={width}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index: elIndex}) => {
          return (
            <View>
              <View style={styles.top}>
                <DefaultText
                  title={`${index + 1}/${data.length}`}
                  style={styles.index}
                />
              </View>
              <DefaultVideo
                path={item.path}
                style={[{height, width}]}
                play={elIndex === index && inView}
                repeat
              />
              <View style={styles.nav}>
                <ContributorButton moment={item} />
                <View style={styles.buttons}>
                  <ReplyButton
                    linkIds={data.map(({id}) => id)}
                    id={item.id}
                    style={styles.button}
                  />
                  <LikeButton
                    id={item.id}
                    style={styles.button}
                    collection={item.collection}
                  />
                  <ReportButton
                    collection={item.collection}
                    id={item.id}
                    style={styles.button}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MomentSummaryCard;

const styles = StyleSheet.create({
  top: {
    top: 50,
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
    left: 0,
    right: 0,
  },
  nav: {
    bottom: 40,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    right: 0,
  },
  index: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {flex: 1, alignItems: 'center'},
});
