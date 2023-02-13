import {firebase} from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TDocData, TLocation, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import FollowButton from '../buttons/FollowButton';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  id: string;
};

const UserModal = ({id}: TProps) => {
  const [data, setData] = useState<TDocData>();
  const [status, setStatus] = useState<TStatus>('loading');
  const {authUserData} = useContext(AuthUserContext);

  const {onUpdate} = useContext(ModalContext);

  const {width} = useWindowDimensions();
  const videoWidth = (width - 10) / 3;
  const videoHeight = (videoWidth * 4) / 3;

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
    <DefaultModal style={{zIndex: 200}}>
      {status === 'loading' && !data && (
        <ActivityIndicator style={styles.act} />
      )}
      {data && (
        <DefaultForm
          title={'User'}
          left={{
            onPress: () => onUpdate(undefined),
          }}
          right={{
            icon: authUserData.id === id ? 'gear' : undefined,
            onPress: () => onUpdate({target: 'auth'}),
          }}>
          <FlatList
            data={data.contributeTo?.items}
            ListEmptyComponent={<DefaultText title="No moments found" />}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: 'gray',
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                }}>
                <DefaultIcon icon="user" />
                <View style={{alignItems: 'flex-start', marginLeft: 5}}>
                  <DefaultText
                    title={data.displayName}
                    textStyle={{fontWeight: 'bold', fontSize: 16}}
                  />
                  <FollowButton
                    user={{
                      id: data.id,
                    }}
                  />
                </View>
              </View>
            }
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
                  content={{...item, user: {id: data.id}}}
                  onDelete={() => setStatus('loading')}
                  onPress={() => {
                    onUpdate({target: 'moments', id: item.id});
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
