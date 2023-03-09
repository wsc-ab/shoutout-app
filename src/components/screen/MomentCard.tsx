import React, {useRef, useState} from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';

import {TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getTimeGap} from '../../utils/Date';
import {getCityAndCountry} from '../../utils/Map';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

import DefaultVideo from '../defaults/DefaultVideo';
import UserProfileImage from '../images/UserProfileImage';
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
  momentIndex?: number;
  pauseOnModal?: boolean;
  inView: boolean;
  blur?: boolean;
  channel?: {id: string};
};

const MomentCard = ({
  moments,
  style,
  momentIndex,
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
      content: {path: string; mode: 'camera'; media: 'image' | 'video'};
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
              bottom: 70,
              zIndex: 100,
              left: 0,
              right: 0,
              marginHorizontal: 20,
              borderRadius: 10,
              padding: 10,
              backgroundColor: defaultBlack.lv3(0.5),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 5,
              }}>
              <DefaultIcon
                icon={item.content.media === 'video' ? 'video' : 'image'}
              />
              {item.content.mode === 'camera' && (
                <DefaultText
                  title={'Camera'}
                  textStyle={{
                    fontWeight: 'bold',
                  }}
                  style={{
                    backgroundColor: defaultRed.lv1,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginLeft: 5,
                    alignSelf: 'flex-start',
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                  }}
                />
              )}
              <DefaultText
                title={`${index + 1} / ${moments.length}`}
                style={{flex: 1, alignItems: 'flex-end'}}
                textStyle={{fontWeight: 'bold'}}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <UserProfileImage
                user={{
                  id: moments[0].createdBy.id,
                }}
              />
              <View style={{marginLeft: 5}}>
                <DefaultText
                  title={moments[0].createdBy.displayName}
                  textStyle={{fontWeight: 'bold'}}
                />
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
            </View>
          </View>
          {item.content.media === 'image' && (
            <DefaultImage
              moment={{id: item.id}}
              image={item.content.path}
              imageStyle={{height, width}}
            />
          )}

          {item.content.media === 'video' && (
            <DefaultVideo
              moment={{id: item.id, content: {path: item.content.path}}}
              videoStyle={{height, width}}
              mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
              pauseOnModal={pauseOnModal}
              repeat
              inView={inView && index === elIndex}
              blur={blur}
              channel={channel}
            />
          )}
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

export default MomentCard;
