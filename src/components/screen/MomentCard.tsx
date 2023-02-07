import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';

import {
  TDocData,
  TDocSnapshot,
  TLocation,
  TObject,
  TTimestamp,
} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import AddButton from '../buttons/AddButton';
import ContributorsButton from '../buttons/ContributorsButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';
import DefaultAlert from '../defaults/DefaultAlert';

import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
  inView: boolean;
  path?: string;
};

const MomentCard = ({moment, path, style, inView}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();

  const ref = useRef<FlatList>(null);

  const [index, setIndex] = useState(0);
  const [pathUsed, setPathUsed] = useState(false);

  useEffect(() => {
    if (!pathUsed) {
      const pathIndex = data?.contents.items.findIndex(
        ({path: elPath}: {path: string}) => elPath === path,
      );

      if (pathIndex !== -1) {
        ref.current?.scrollToIndex({index: pathIndex, animated: true});
        setPathUsed(true);
      }
    }
  }, [data?.contents.items, path, pathUsed]);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      const newMoment = doc.data();

      if (newMoment) {
        setData(newMoment);
      }
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get moment data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('moments')
      .doc(moment.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [moment.id]);

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

  const onContributor = (newIndex: number) => {
    ref.current?.scrollToIndex({index: newIndex, animated: true});
  };

  if (!data) {
    return null;
  }

  const users = data.contents.items.map(
    ({
      user,
      addedAt,
      location,
    }: {
      user: {id: string; name: string; thumbnail?: string};
      addedAt: TTimestamp;
      location?: TLocation;
    }) => ({...user, addedAt, location}),
  );

  if (!data) {
    return null;
  }

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: width,
    offset: width * itemIndex,
    index: itemIndex,
  });

  return (
    <View style={style}>
      <FlatList
        ref={ref}
        data={data.contents.items as TObject[]}
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
        keyExtractor={item => item.path}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({
          item,
          index: elIndex,
        }: {
          item: {
            id: string;
            path: string;
            user: {id: string; name: string};
            likeFrom: {ids: string[]; number: number};
            addedAt: TTimestamp;
          };
          index: number;
        }) => {
          return (
            <View style={{height, width}}>
              <DefaultVideo
                path={item.path}
                videoStyle={{height, width}}
                play={elIndex === index && inView}
                repeat
              />
              <View style={styles.buttons}>
                <LikeButton
                  moment={{
                    id: item.id,
                    path: item.path,
                    user: {id: item.user.id},
                    likeFrom: item.likeFrom,
                  }}
                  style={styles.button}
                />
                <AddButton
                  id={item.id}
                  number={data.contents.number}
                  style={styles.button}
                />
                <ShareButton
                  input={{
                    title:
                      'Hey! Check this roll out! You can also add your moment to it!',
                    param: 'moments',
                    value: moment.id,
                    image: {path: item.path, type: 'video'},
                  }}
                  style={styles.button}
                />
                <ReportButton
                  moment={{
                    id: item.id,
                    path: item.path,
                    user: {id: item.user.id},
                  }}
                  style={styles.button}
                />
              </View>
            </View>
          );
        }}
      />
      <ContributorsButton
        users={users}
        index={index}
        onPress={onContributor}
        style={styles.users}
      />
    </View>
  );
};

export default MomentCard;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    bottom: 40,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    right: 0,
  },
  button: {flex: 1, alignItems: 'center'},
  users: {position: 'absolute', bottom: 90},
});
