import firebase from '@react-native-firebase/app';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, View} from 'react-native';

import {TObject} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import MomentCard from '../screen/MomentCard';
import ContentModal from './MomentModal';

type TProps = {
  id: string;
  onCancel: () => void;
};

const UserModal = ({id, onCancel}: TProps) => {
  const [data, setData] = useState<TObject>();
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const userData = (
          await firebase.firestore().collection('users').doc(id).get()
        ).data();

        if (isMounted) {
          setData(userData);
          setStatus('loaded');
        }
      } catch (error) {
        if (isMounted) {
          DefaultAlert({
            title: 'Error',
            message: (error as {message: string}).message,
          });
          setStatus('error');
        }
      }
    };

    if (status === 'loading') {
      load();
    }

    return () => {
      isMounted = false;
    };
  }, [id, status]);

  const [modal, setModal] = useState<'content'>();
  const [contentIndex, setContentIndex] = useState<number>();

  return (
    <DefaultModal>
      {status === 'loading' && !data && <ActivityIndicator style={{flex: 1}} />}
      {data && (
        <DefaultForm title={data.name} left={{onPress: onCancel}}>
          <FlatList
            data={data.contributeTo?.items ?? []}
            ListEmptyComponent={<DefaultText title="No moments found" />}
            renderItem={({item, index}) => {
              return (
                <Pressable key={item.id}>
                  <MomentCard
                    moment={item}
                    showNav={false}
                    initPaused={true}
                    style={{alignSelf: 'center'}}
                  />
                  <DefaultText
                    title="Show"
                    onPress={() => {
                      console.log('called');

                      setContentIndex(index);
                      setModal('content');
                    }}
                  />
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  marginVertical: 10,
                }}
              />
            )}
          />
        </DefaultForm>
      )}
      {modal === 'content' && data && contentIndex && (
        <ContentModal
          onCancel={() => setModal(undefined)}
          id={data.contributeTo.items[contentIndex].id}
          onNext={() => {
            const nextContentId =
              contentIndex !== data.contributeTo.items.length - 1
                ? 0
                : contentIndex + 1;
            setContentIndex(nextContentId);
          }}
        />
      )}
    </DefaultModal>
  );
};

export default UserModal;
