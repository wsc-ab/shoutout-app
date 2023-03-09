import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  TextInput,
  View,
} from 'react-native';

import {addComment, removeComment} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {getTimeGap} from '../../utils/Date';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';
import SubmitIcon from './DeleteIcon';

type TProps = {
  moment: {
    id: string;
  };
  onCancel: () => void;
};

const CommentsModal = ({moment, onCancel}: TProps) => {
  const [value, setValue] = useState<string>('');

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

  const renderItem = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}} key={item.addedAt}>
        <UserProfileImage
          user={{
            id: item.user.id,
          }}
        />
        <View style={{marginLeft: 10, flex: 1}}>
          <DefaultText
            title={item.user.displayName}
            textStyle={{fontWeight: 'bold', fontSize: 16}}
            style={{marginBottom: 5, flex: 1}}
          />
          <DefaultText title={item.detail} textStyle={{}} />
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
            }}>
            <DefaultText
              title={`${getTimeGap(item.addedAt)} ago`}
              textStyle={{fontSize: 14, color: 'lightgray'}}
            />
            <SubmitIcon
              onPress={async () => await onRemove(item)}
              icon={'times'}
            />
          </View>
        </View>
      </View>
    );
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
    <DefaultBottomModal onCancel={onCancel}>
      <View
        style={{
          top: '40%',
          height: '60%',
          bottom: 0,
          backgroundColor: defaultBlack.lv2(1),
          paddingTop: 20,
        }}>
        <FlatList
          data={data?.comments ?? []}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={() => setStatus('loading')}
              tintColor={'gray'}
            />
          }
          ItemSeparatorComponent={() => <View style={{marginVertical: 10}} />}
          renderItem={renderItem}
          contentContainerStyle={{paddingVertical: 10, paddingBottom: 100}}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center'}}>
              <DefaultText
                title="No comment"
                textStyle={{fontWeight: 'bold'}}
              />
            </View>
          )}
        />
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          padding: 10,
          alignItems: 'flex-end',
        }}>
        <TextInput
          value={value}
          multiline
          onChangeText={setValue}
          placeholder="Comment"
          style={[
            {
              flex: 1,
              alignItems: 'center',
              padding: 10,
              marginBottom: 24,
              height: 50,
              textAlignVertical: 'center',
            },
          ]}
        />
        <SubmitIcon
          icon="plus"
          color={value ? 'black' : 'gray'}
          onPress={onAdd}
          style={{
            padding: 10,
            marginBottom: 24,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </KeyboardAvoidingView>
    </DefaultBottomModal>
  );
};

export default CommentsModal;
