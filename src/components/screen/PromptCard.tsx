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
import {getThumbnailPath} from '../../utils/Storage';
import AddMomentButton from '../buttons/AddMomentButton';
import ContributorsButton from '../buttons/ContributorsButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  prompt: TDocData;
  style?: TStyleView;
  mount: boolean;
  path?: string;
  pauseOnModal?: boolean;
  inView: boolean;
};

const PromptCard = ({
  prompt,
  path,
  style,
  pauseOnModal = true,
  mount,
  inView,
}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {authUserData} = useContext(AuthUserContext);
  const ref = useRef<FlatList>(null);

  const [index, setIndex] = useState(0);
  const [initialScrollIndex, setInitialScrollIndex] = useState<number>();

  useEffect(() => {
    if (data) {
      const pathIndex = data?.moments.items.findIndex(
        ({path: elPath}: {path: string}) => elPath === path,
      );

      if (pathIndex >= 0) {
        setInitialScrollIndex(pathIndex);
      }
    }
  }, [data, path]);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      const newMoment = doc.data();

      if (newMoment) {
        setData(newMoment);
      }
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get prompt data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('prompts')
      .doc(prompt.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [prompt.id]);

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

  const users = data.moments.items.map(
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

  const added = users.some(({id: elId}) => elId === authUserData.id);

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
      name?: string;
    };
    index: number;
  }) => {
    return (
      <View style={{flex: 1}}>
        <View style={{height, width}}>
          <DefaultText
            title={item.name}
            style={{
              position: 'absolute',
              top: 100,
              zIndex: 100,
              paddingHorizontal: 10,
            }}
            textStyle={{fontWeight: 'bold', fontSize: 20}}
          />
          {!added && (
            <View>
              <DefaultImage
                imageStyle={{height, width}}
                blurRadius={30}
                image={getThumbnailPath(item.path, 'video')}
              />
              <DefaultText
                title="Share your moment to view"
                style={styles.add}
              />
            </View>
          )}

          {added && (
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
          )}
        </View>
        {!added && <AddMomentButton id={item.id} style={styles.addMoment} />}
      </View>
    );
  };

  return (
    <View style={style}>
      <FlatList
        ref={ref}
        data={data.moments.items as TObject[]}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        horizontal
        initialScrollIndex={initialScrollIndex}
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
      />
    </View>
  );
};

export default PromptCard;

const styles = StyleSheet.create({
  users: {position: 'absolute', bottom: 90},
  add: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoment: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultBlack.lv3(1),
    marginHorizontal: 5,
    borderRadius: 20,
  },
});
