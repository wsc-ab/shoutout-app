import firebase from '@react-native-firebase/app';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, RefreshControl, ScrollView, View} from 'react-native';

import {TObject} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

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
          Alert.alert('Please retry', (error as {message: string}).message);
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
      {data && (
        <DefaultForm
          title={data.name}
          left={{onPress: onCancel}}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => setStatus('loading')}
                tintColor="lightgray"
              />
            }>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <DefaultText title="Link" textStyle={{fontWeight: 'bold'}} />
              <DefaultText
                title={data?.link ?? 'Link is not set.'}
                style={{
                  marginLeft: 10,
                }}
                onPress={
                  data?.link
                    ? () => Linking.openURL('https://' + data?.link)
                    : undefined
                }
              />
            </View>
          </ScrollView>
        </DefaultForm>
      )}
    </DefaultModal>
  );
};

export default UserModal;
