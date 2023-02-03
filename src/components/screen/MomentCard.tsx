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
  TTimestamp,
} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import AddButton from '../buttons/AddButton';
import ContributorsButton from '../buttons/ContributorsButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
  inView: boolean;
};

const MomentCard = ({moment, style, inView}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>(moment);
  const ref = useRef<FlatList>(null);

  const [index, setIndex] = useState(0);

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

  const allContributors = data.contents.items.map(
    ({
      user,
      addedAt,
      location,
    }: {
      user: {id: string; name: string; thumbnail?: string};
      addedAt: TTimestamp;
      location: TLocation;
    }) => ({...user, addedAt, location}),
  );

  const onContributor = (newIndex: number) => {
    ref.current?.scrollToIndex({index: newIndex, animated: true});
  };

  return (
    <View style={style}>
      <FlatList
        ref={ref}
        data={data.contents.items}
        initialNumToRender={1}
        horizontal
        snapToInterval={width}
        snapToAlignment={'start'}
        decelerationRate="fast"
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
            location: TLocation;
            user: {id: string; name: string};
            likeFrom: {ids: string[]; number: number};
            addedAt: TTimestamp;
          };
          index: number;
        }) => {
          return (
            <View>
              <View style={styles.top}>
                <DefaultText
                  title={`${index + 1}/${data.contents.number}`}
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
                <View style={styles.buttons}>
                  <AddButton id={item.id} style={styles.button} />
                  <LikeButton
                    moment={{
                      id: item.id,
                      path: item.path,
                      user: {id: item.user.id},
                      likeFrom: {number: item.likeFrom.number},
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
            </View>
          );
        }}
      />
      <ContributorsButton
        users={allContributors}
        index={index}
        onPress={onContributor}
        style={styles.contributors}
      />
    </View>
  );
};

export default MomentCard;

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
    marginTop: 10,
  },
  button: {flex: 1, alignItems: 'center'},
  contributors: {position: 'absolute', bottom: 100},
});
