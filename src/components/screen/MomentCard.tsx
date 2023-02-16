import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
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
import CreateButton from '../buttons/CreateButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';

import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
  mount: boolean;
  path?: string;
  pauseOnModal?: boolean;
  inView: boolean;
};

const MomentCard = ({
  moment,
  path,
  style,
  pauseOnModal = true,
  mount,
  inView,
}: TProps) => {
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

  const renderItem = ({
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
          index={index}
          elIndex={elIndex}
          path={item.path}
          videoStyle={{height, width}}
          mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
          pauseOnModal={pauseOnModal}
          repeat
          inView={inView && index === elIndex}
        />
        <ScrollView
          style={styles.buttons}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <CreateButton style={styles.button} />
          <AddButton
            id={item.id}
            number={data.contents.number}
            style={styles.button}
          />
          <LikeButton
            moment={{
              id: item.id,
              path: item.path,
              user: {id: item.user.id},
              likeFrom: item.likeFrom,
            }}
            style={styles.button}
          />

          <ShareButton
            input={{
              title:
                'Hey! Check this moment out! You can also connect yours to it!',
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
        </ScrollView>
      </View>
    );
  };

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
        renderItem={renderItem}
      />
      <ContributorsButton
        users={users}
        index={index}
        onPress={onContributor}
        style={styles.users}
        type={data.type}
      />
    </View>
  );
};

export default MomentCard;

const styles = StyleSheet.create({
  buttons: {
    bottom: 40,
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 100,
    left: 0,
  },
  button: {
    width: 70,
    marginRight: 10,
    backgroundColor: defaultBlack.lv2(1),
    borderRadius: 10,
  },
  users: {position: 'absolute', bottom: 90},
});
