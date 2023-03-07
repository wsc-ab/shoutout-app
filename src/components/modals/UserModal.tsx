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
import MomentSummary from '../screen/MomentSummary';

import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {updateUserViewedAt} from '../../functions/User';
import {TDocData, TLocation, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {getSameIds} from '../../utils/Array';
import {getNewMoments} from '../../utils/Moment';
import FollowButton from '../buttons/FollowButton';
import UserProfileImage from '../images/UserProfileImage';

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

  useEffect(() => {
    const updateViewedAt = async () => {
      await updateUserViewedAt({user: {id: data?.id}});
    };
    if (data?.id === authUserData.id) {
      updateViewedAt();
    }
  }, [authUserData.id, data?.id]);

  const newMoments = data ? getNewMoments({authUserData: data}) : [];

  const friend =
    getSameIds(authUserData.followTo.items, authUserData.followFrom.items).some(
      ({id: elId}) => elId === data?.id,
    ) || data?.id === authUserData.id;

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
            onPress:
              authUserData.id === id
                ? () => onUpdate({target: 'auth'})
                : undefined,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              marginHorizontal: 10,
            }}>
            <UserProfileImage user={{id}} />
            <View style={{alignItems: 'flex-start', marginLeft: 10}}>
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
          {!friend && (
            <DefaultText
              title="Moments are only shown to friends."
              style={{
                marginHorizontal: 10,
              }}
            />
          )}
          {friend && (
            <FlatList
              data={data.contributeTo.items}
              indicatorStyle="white"
              style={{
                paddingHorizontal: 10,
              }}
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
                  addedAt: TTimestamp;
                  location: TLocation;
                  name: string;
                  createdBy: {id: string; displayName: string};
                };
                index: number;
              }) => {
                console.log(item, 'i');

                return (
                  <MomentSummary
                    moment={{
                      ...item,
                      createdBy: {
                        id: data.id,
                        displayName: data.displayName,
                      },
                    }}
                    onDelete={() => setStatus('loading')}
                    onPress={id => {
                      const momentIndex = data.contributeTo.items.findIndex(
                        item => item.id === id,
                      );
                      data.contributeTo.items.unshift(
                        data.contributeTo.items.splice(momentIndex, 1)[0],
                      );
                      onUpdate({
                        target: 'moments',
                        data: {
                          moments: data.contributeTo.items.map(item => ({
                            ...item,
                            createdBy: {
                              id: data.id,
                              displayName: data.displayName,
                            },
                          })),
                        },
                      });
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
          )}
          {}
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
