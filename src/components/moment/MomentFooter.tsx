import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
import {defaultBlack} from '../defaults/DefaultColors';
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, {height: height / 3}, style]}
      enabled={Platform.OS === 'ios'}
      behavior={'position'}>
      <FlatList
        nestedScrollEnabled
        data={[
          {
            detail: moment.name,
            addedAt: moment.createdAt,
            user: moment.createdBy,
          },
          ...(moment?.comments ?? []),
        ]}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <CommentHeader
            moment={moment}
            index={index}
            length={length}
            firstUploadDate={firstUploadDate}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: defaultBlack.lv2(1),
          paddingTop: 10,
          paddingBottom: 40,
          flexDirection: 'row',
        }}>
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
    flex: 1,
  },
  like: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
  },
  comment: {flex: 1},
});
