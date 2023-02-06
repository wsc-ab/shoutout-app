import firebase from '@react-native-firebase/app';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import {TDocData, TLocation, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';
import RollModal from './RollModal';

type TProps = {
  id: string;
  onCancel: () => void;
};

const UserModal = ({id, onCancel}: TProps) => {
  const [data, setData] = useState<TDocData>();
  const [status, setStatus] = useState<TStatus>('loading');
  const [rollId, setRollId] = useState<string>();
  const [modal, setModal] = useState<'roll'>();

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

  const {width} = useWindowDimensions();
  const videoWidth = (width - 10) / 3;
  const videoHeight = (videoWidth * 4) / 3;

  if (!data) {
    return null;
  }

  return (
    <DefaultModal>
      {status === 'loading' && !data && (
        <ActivityIndicator style={styles.act} />
      )}
      {data && (
        <DefaultForm
          title={data.displayName}
          left={{
            onPress: onCancel,
          }}>
          <FlatList
            data={data.contributeTo?.items}
            ListEmptyComponent={<DefaultText title="No moments found" />}
            contentContainerStyle={styles.container}
            keyExtractor={(item, index) => item.id + index}
            refreshControl={
              <RefreshControl
                refreshing={status === 'loading'}
                onRefresh={() => setStatus('loading')}
                tintColor={'gray'}
              />
            }
            renderItem={({
              item,
            }: {
              item: {
                id: string;
                path: string;
                addedAt: TTimestamp;
                location?: TLocation;
              };
            }) => {
              return (
                <ContentCard
                  content={{...item, user: {id}}}
                  onDelete={() => setStatus('loading')}
                  onPress={() => {
                    setRollId(item.id);
                    setModal('roll');
                  }}
                  contentStyle={{
                    width: videoWidth,
                    height: videoHeight,
                  }}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.seperator} />}
          />
        </DefaultForm>
      )}
      {modal === 'roll' && rollId && (
        <RollModal
          roll={{
            id: rollId,
          }}
          onCancel={() => {
            setModal(undefined);
            setRollId(undefined);
          }}
        />
      )}
    </DefaultModal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  container: {paddingBottom: 100},
  act: {flex: 1},
  seperator: {
    marginBottom: 20,
  },
});
