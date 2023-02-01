import firebase from '@react-native-firebase/app';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

import {TObject} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {getDate} from '../../utils/Date';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

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

  return (
    <DefaultModal>
      {status === 'loading' && !data && <ActivityIndicator style={{flex: 1}} />}
      {data && (
        <DefaultForm title={data.name} left={{onPress: onCancel}}>
          <FlatList
            data={data.contributeTo?.items ?? []}
            renderItem={({item}) => {
              const createdAt = getDate(item.addedAt);
              return (
                <View key={item.id}>
                  <DefaultText
                    title={`${createdAt.getFullYear()}/${
                      createdAt.getMonth() + 1
                    }/${createdAt.getDate() + 1}`}
                    style={{marginBottom: 5, alignItems: 'center'}}
                  />
                  <ContentCard
                    content={item}
                    showNav={false}
                    onNext={undefined}
                  />
                </View>
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
    </DefaultModal>
  );
};

export default UserModal;
