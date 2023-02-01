import firebase from '@react-native-firebase/app';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, View} from 'react-native';

import {TObject} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import MomentCard from '../screen/MomentCard';
import MomentModal from './MomentModal';

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

  const [modal, setModal] = useState<'moment'>();
  const [momentIndex, setMomentIndex] = useState<number>();

  return (
    <DefaultModal>
      {status === 'loading' && !data && <ActivityIndicator style={{flex: 1}} />}
      {data && (
        <DefaultForm title={data.name} left={{onPress: onCancel}}>
          <FlatList
            data={data.contributeTo?.items ?? []}
            ListEmptyComponent={<DefaultText title="No moments found" />}
            contentContainerStyle={{paddingBottom: 100}}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  key={item.id}
                  style={{justifyContent: 'center', alignItems: 'center'}}
                  onPress={() => {
                    setMomentIndex(index);
                    setModal('moment');
                  }}>
                  <MomentCard
                    moment={item}
                    showNav={false}
                    initPaused={true}
                    style={{alignSelf: 'center'}}
                    disabled={true}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      alignItems: 'center',
                      width: 300,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <DefaultIcon icon="heart" />
                      <DefaultText
                        title={item.likeFrom.number.toString()}
                        style={{marginLeft: 5}}
                        onPress={() => {
                          setMomentIndex(index);
                          setModal('moment');
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}>
                      <DefaultIcon icon="reply" />
                      <DefaultText
                        title={item.linkFrom.number.toString()}
                        style={{marginLeft: 5}}
                        onPress={() => {
                          setMomentIndex(index);
                          setModal('moment');
                        }}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginVertical: 10,
                }}
              />
            )}
          />
        </DefaultForm>
      )}
      {modal === 'moment' && data && momentIndex !== undefined && (
        <MomentModal
          onCancel={() => setModal(undefined)}
          id={data.contributeTo.items[momentIndex].id}
          onNext={() => {
            const nextmomentId =
              momentIndex !== data.contributeTo.items.length - 1
                ? 0
                : momentIndex + 1;
            setMomentIndex(nextmomentId);
          }}
        />
      )}
    </DefaultModal>
  );
};

export default UserModal;
