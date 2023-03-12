import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, TextInput, View} from 'react-native';

import {addComment, removeComment} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {getTimeGap} from '../../utils/Date';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';
import SubmitIcon from '../buttons/SubmitIconButton';

type TProps = {
  moment: {
    id: string;
  };

  onCancel: () => void;
};

const CommentsModal = ({moment, onCancel}: TProps) => {
  const [value, setValue] = useState<string>();

  const [data, setData] = useState<TDocData>();
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const momentData = (
          await firestore().collection('moments').doc(moment.id).get()
        ).data();
        setData(momentData);
        setStatus('loaded');
        setValue('');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [moment.id, status]);

  const onRemove = async ({detail, addedAt}) => {
    try {
      await removeComment({moment, comment: {detail, addedAt}});
      setStatus('loading');
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to remove comment'});
    }
  };



  const onAdd = async () => {
    if (!value) {
      return;
    }
    try {
      await addComment({moment, comment: {detail: value}});
      setStatus('loading');
    } catch (error) {
    } finally {
    }
  };
  return (
    <View style={{}}>
      <TextInput
        value={value}
        multiline
        onChangeText={setValue}
        placeholder="Comment"
        style={[
          {
            // flex: 1,
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 10,
            // marginBottom: 24,
            // height: 50,
            textAlignVertical: 'center',
          },
        ]}
      />
      {value?.length >= 1 && (
        <SubmitIcon
          icon="plus"
          color={'black'}
          onPress={onAdd}
          style={{
            padding: 10,
            marginBottom: 24,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
    </View>
  );
};

export default CommentsModal;
