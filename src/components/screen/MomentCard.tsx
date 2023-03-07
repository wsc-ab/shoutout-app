import React, {useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';

import {TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getTimeGap} from '../../utils/Date';
import {getCityAndCountry} from '../../utils/Map';
import ContributorButton from '../buttons/ContributorButton';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';

import DefaultVideo from '../defaults/DefaultVideo';
import Footer from './Footer';

type TProps = {
  moments: {
    id: string;
    name: string;
    content: {path: string};
    createdBy: {id: string; displayName: string};
  }[];
  style?: TStyleView;
  mount: boolean;
  pauseOnModal?: boolean;
  inView: boolean;
  blur?: boolean;
  channel?: {id: string};
};

const MomentCard = ({
  moments,
  style,
  pauseOnModal = true,
  mount,
  inView,
  blur,
  channel,
}: TProps) => {
  const {height, width} = useWindowDimensions();

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
      content: {path: string; mode: 'camera'};
      addedAt: TTimestamp;
      name: string;
      createdBy: {id: string};
    };
    index: number;
  }) => {
    return (
      <View style={{flex: 1}}>
        <View style={{height, width}}>
          <View
            style={{
              position: 'absolute',
              top: 100,
              zIndex: 100,
              paddingHorizontal: 20,
            }}>
            {item.content.mode === 'camera' && (
              <DefaultText
                title={'Camera'}
                textStyle={{fontWeight: 'bold'}}
                style={{
                  backgroundColor: defaultRed.lv1,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginBottom: 5,
                  alignSelf: 'flex-start',
                  paddingVertical: 3,
                  paddingHorizontal: 6,
                }}
              />
            )}

            <DefaultText
              title={item.name}
              textStyle={{fontWeight: 'bold', fontSize: 20}}
            />
            <DefaultText
              title={getCityAndCountry(item.location.formatted)}
              textStyle={{fontSize: 14, color: 'lightgray'}}
              numberOfLines={3}
            />
            <DefaultText
              title={`${getTimeGap(item.createdAt ?? item.addedAt)} ago`}
              textStyle={{fontSize: 14, color: 'lightgray'}}
              numberOfLines={3}
            />
          </View>

          <DefaultVideo
            path={item.content.path}
            videoStyle={{height, width}}
            mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
            pauseOnModal={pauseOnModal}
            repeat
            inView={inView && index === elIndex}
            blur={blur}
            channel={channel}
          />
        </View>
        {!blur && <Footer moment={item} style={{marginHorizontal: 10}} />}
      </View>
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
          console.log(item, 'item');

          return item.id;
        }}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={renderItem}
      />

      <ContributorButton
        user={moments[0].createdBy}
        index={index}
        length={moments.length}
        style={styles.page}
      />
    </View>
  );
};

export default MomentCard;

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
