import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TDocData, TTimestamp} from '../../types/Firebase';
import {getDiffDays} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  moment: TDocData;
  firstUploadDate: TTimestamp;
  index: number;
  length: number;
};

const CommentHeader = ({moment, firstUploadDate, index, length}: TProps) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <DefaultText
          title={`D+${getDiffDays({
            start: firstUploadDate,
            end: moment.createdAt,
          })}`}
          style={styles.tag}
        />
        <DefaultIcon
          icon={moment.content.media === 'video' ? 'video' : 'image'}
          style={styles.tag}
          textStyle={styles.tagText}
        />
        <DefaultText
          title={moment.content.mode === 'camera' ? 'Camera' : 'Library'}
          textStyle={styles.tagText}
          style={styles.tag}
        />
      </View>
      <DefaultText
        title={`${index + 1} / ${length}`}
        textStyle={styles.tagText}
        style={styles.tag}
      />
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
    backgroundColor: defaultBlack.lv4(1),
    padding: 10,
  },
});
