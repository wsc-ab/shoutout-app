import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TDocData} from '../../types/Firebase';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  moment: TDocData;
  index: number;
  length: number;
};

const CommentHeader = ({moment, index, length}: TProps) => {
  return (
    <View style={styles.container}>
      <DefaultIcon
        icon={moment.content.media === 'video' ? 'video' : 'image'}
      />
      <DefaultText
        title={`${index + 1} / ${length}`}
        textStyle={styles.tagText}
        style={styles.tag}
      />
      {moment.content.mode === 'camera' && (
        <DefaultText
          title={'Camera'}
          textStyle={styles.tagText}
          style={styles.tag}
        />
      )}
    </View>
  );
};

export default CommentHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  tagText: {
    fontWeight: 'bold',
  },
  tag: {
    borderRadius: 10,
    marginLeft: 10,
  },
});
