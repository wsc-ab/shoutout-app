import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
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

  return (
    <View>
      <View style={[{flexDirection: 'row', alignItems: 'center'}, style]}>
        <DefaultIcon
          icon="comment"
          onPress={() => setModal('comments')}
          color={'white'}
          style={styles.icon}
          size={20}
        />
        <DefaultText title={(moment.comments?.length ?? 0).toString()} />
      </View>
      {modal === 'comments' && (
        <CommentsModal moment={moment} onCancel={() => setModal(undefined)} />
      )}
    </View>
  );
};

export default CommentButton;

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
});
