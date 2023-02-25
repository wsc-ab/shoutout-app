import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {
  TDocData,
  TDocSnapshot,
  TLocation,
  TObject,
  TTimestamp,
} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {sentToFirst} from '../../utils/Array';
import ContributorsButton from '../buttons/ContributorsButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';

import DefaultVideo from '../defaults/DefaultVideo';
import Footer from './Footer';

type TProps = {
  moment: {id: string};
  style?: TStyleView;
  mount: boolean;
  path?: string;
  pauseOnModal?: boolean;
  inView: boolean;
  blur?: boolean;
  room?: {id: string};
};

const MomentCard = ({
  moment,
  path,
  style,
  pauseOnModal = true,
  mount,
  inView,
  blur,
  room,
}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();

  const {authUserData} = useContext(AuthUserContext);

  const ref = useRef<FlatList>(null);

  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(authUserData.contributeTo.ids.includes(moment.id));
  }, [authUserData.contributeTo.ids, moment.id]);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      const newMoment = doc.data();

      if (!doc.exists) {
        return DefaultAlert({
          title: 'Failed to read data',
          message: 'This moment seems to be deleted.',
        });
      }

      if (newMoment) {
        newMoment.contents.items = path
          ? sentToFirst({
              array: newMoment.contents.items,
              field: 'path',
              value: path,
            })
          : newMoment.contents.items;

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
  }, [moment.id, path]);

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
      uploading,
      canceled,
    }: {
      uploading?: boolean;
      user: {id: string; name: string};
      addedAt: TTimestamp;
      location: TLocation;
      canceled?: boolean;
    }) => ({...user, uploading, canceled, addedAt, location}),
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
      uploading?: boolean;
      user: {id: string; name: string};
      addedAt: TTimestamp;
      name: string;
    };
    index: number;
  }) => {
    return (
      <View style={{flex: 1}}>
        <View style={{height, width}}>
          <DefaultText
            title={item.name}
            numberOfLines={4}
            style={{
              position: 'absolute',
              top: 100,
              zIndex: 100,
              paddingHorizontal: 20,
            }}
            textStyle={{fontWeight: 'bold', fontSize: 20}}
          />
          <DefaultVideo
            path={item.path}
            videoStyle={{height, width}}
            mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
            pauseOnModal={pauseOnModal}
            repeat
            inView={inView && index === elIndex}
            blur={blur}
            room={room}
          />
        </View>
        {!blur && (
          <Footer
            added={added}
            content={item}
            moment={moment}
            style={{marginHorizontal: 10}}
          />
        )}
        {item.uploading && <DefaultText title="Being uploaded" />}
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
        type={data.type}
        onPress={onContributor}
        style={styles.users}
      />
    </View>
  );
};

export default MomentCard;

const styles = StyleSheet.create({
  users: {position: 'absolute', bottom: 70},
});
