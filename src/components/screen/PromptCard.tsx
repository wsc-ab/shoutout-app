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
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import MomentCard from './MomentCard';

type TProps = {
  style?: TStyleView;
  prompt: {id: string};
  pauseOnModal?: boolean;
  path?: string;
  mount: boolean;
};

const PromptCard = ({style, prompt, pauseOnModal, path, mount}: TProps) => {
  const [data, setData] = useState<{id: string; path: string}[]>([]);

  const [status, setStatus] = useState<TStatus>('loading');
  const {height, width} = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [initialScrollIndex, setInitialScrollIndex] = useState<number>();
  const {authUserData} = useContext(AuthUserContext);
  const [added, setAdded] = useState(true);

  useEffect(() => {
    if (data) {
      const pathIndex = data.findIndex(
        ({path: elPath}: {path: string}) => elPath === path,
      );

      if (pathIndex >= 0) {
        setInitialScrollIndex(pathIndex);
      }
    }
  }, [data, path]);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      const newPrompt = doc.data();

      if (newPrompt) {
        const addedUserIds = newPrompt.moments.items.map(
          ({user: {id: elId}}) => elId,
        );

        const newAdded = addedUserIds.includes(authUserData.id);
        setAdded(newAdded);
        setData(newPrompt.moments.items);
      }
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get moment data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('prompts')
      .doc(prompt.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [authUserData.id, prompt.id]);

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

  if (status === 'error') {
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

  const ListEmptyComponent = (
    <>
      {status === 'loaded' ? (
        <DefaultText
          title="No moment found. Please reload."
          style={styles.noMoment}
        />
      ) : null}
    </>
  );

  console.log(added, 'added');

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: {id: string};
    index: number;
  }) => {
    return (
      <View
        style={{
          height,
          width,
        }}>
        <MomentCard
          moment={item}
          mount={index - 1 <= elIndex && elIndex <= index + 1 && mount}
          pauseOnModal={pauseOnModal}
          inView={index === elIndex}
          blur={!added}
          promptId={prompt.id}
        />
      </View>
    );
  };

  const onEndReached = () => {
    if (data.length >= 50) {
      setData([]);
      setStatus('loading');
    } else {
      setStatus('loadMore');
    }
  };

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: height,
    offset: height * itemIndex,
    index: itemIndex,
  });

  const keyExtractor = (item: TDocData, elIndex: number) => item.id + elIndex;

  return (
    <View style={style}>
      <FlatList
        data={data}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        initialScrollIndex={initialScrollIndex}
        ListEmptyComponent={ListEmptyComponent}
        snapToInterval={height}
        snapToAlignment={'start'}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onEndReached={onEndReached}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PromptCard;

const styles = StyleSheet.create({
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
  noMoment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
