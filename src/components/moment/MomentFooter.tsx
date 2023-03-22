import React, {useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {TDocData, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import CommentButton from '../buttons/CommentButton';
import LikeButton from '../buttons/LikeButton';
import Comment from '../comment/Comment';
import CommentHeader from '../comment/CommentHeader';

type TProps = {
  moment: TDocData;
  channel: TDocData;
  length: number;
  index: number;
  style?: TStyleView;
  firstUploadDate: TTimestamp;
};

const Footer = ({
  moment,
  channel,
  length,
  firstUploadDate,
  index,
  style,
}: TProps) => {
  const fadeAnim = useRef(new Animated.Value(150)).current;

  const {height} = useWindowDimensions();

  const renderItem = ({
    item,
    index: elIndex,
  }: {
    item: {
      addedAt: TTimestamp;
      user: {
        id: string;
        displayName: string;
      };
      detail: string;
    };
    index: number;
  }) => {
    return (
      <Comment
        item={item}
        index={elIndex}
        moment={moment}
        anonymous={channel.options.anonymous}
        channel={channel}
      />
    );
  };

  const expandList = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.spring(fadeAnim, {
      toValue: height / 1.2,
      useNativeDriver: false,
    }).start();
  };

  const short = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.spring(fadeAnim, {
      toValue: 150,
      useNativeDriver: false,
    }).start();
  };

  const [offset, setOffset] = useState(0);

  const onScrollBeginDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const topReached = offsetY <= 0;

    setOffset(offsetY);
    const direction = offsetY < offset ? 'down' : 'up';

    if (topReached && direction === 'up') {
      expandList();
    }
  };

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const topReached = offsetY <= 0;

    setOffset(offsetY);
    const direction = offsetY < offset ? 'down' : 'up';
    if (topReached && direction === 'down') {
      short();
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, style]} behavior="padding">
      <Animated.FlatList
        data={[
          {
            detail: moment.name,
            addedAt: moment.createdAt,
            user: moment.createdBy,
          },
          ...(moment?.comments ?? []),
        ]}
        style={{height: fadeAnim}}
        renderItem={renderItem}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        ListHeaderComponent={() => (
          <CommentHeader
            moment={moment}
            index={index}
            length={length}
            firstUploadDate={firstUploadDate}
          />
        )}
      />
      <View style={styles.buttons}>
        <LikeButton moment={moment} style={styles.like} />
        <CommentButton moment={moment} style={styles.comment} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  buttons: {flexDirection: 'row', paddingBottom: 24},
  like: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
  },
  comment: {flex: 1},
});
