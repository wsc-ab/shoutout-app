import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import CommentsModal from '../modals/CommentsModal';

type TProps = {
  moment: {
    id: string;
    comments: {
      id: string;
      displayName: string;
      addedAt: TTimestamp;
      detail: string;
    }[];
  };
  style?: TStyleView;
};

const CommentButton = ({moment, style}: TProps) => {
  const [modal, setModal] = useState<'comments'>();
  console.log(moment.comments, 'com');

  return (
    <View>
      <DefaultIcon
        style={[styles.container, style]}
        icon="comment"
        onPress={() => setModal('comments')}
        color={'white'}
        size={20}
      />
      {modal === 'comments' && (
        <CommentsModal moment={moment} onCancel={() => setModal(undefined)} />
      )}
    </View>
  );
};

export default CommentButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
