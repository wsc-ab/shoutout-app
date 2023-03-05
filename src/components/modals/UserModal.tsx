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
import {getNewContents} from '../../utils/Moment';
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

  const newContentPaths = data
    ? getNewContents({authUserData: data}).map(({path: elPath}) => elPath)
    : [];

  const sorted = data?.contributeTo?.items.map(item => {
    item.contents = item.contents
      .sort((a, b) => (a.user.id === id ? -1 : b.user.id === id ? 1 : 0))
      .map(content => ({
        ...content,
        new:
          // if user is viewing its own profile
          // show what content is new
          data?.id === authUserData.id
            ? newContentPaths.includes(content.path)
            : false,
      }));

    return item;
  });

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
              data={sorted}
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
                index,
              }: {
                item: {
                  id: string;
                  contents: {
                    path: string;
                    addedAt: TTimestamp;
                    location: TLocation;
                    name: string;
                    user: {id: string; displayName: string};
                    new: boolean;
                  }[];
                };
                index: number;
              }) => {
                return (
                  <MomentSummary
                    moment={item}
                    onDelete={() => setStatus('loading')}
                    onPress={path => {
                      onUpdate({
                        target: 'moments',
                        data: {
                          moments: sorted,
                          momentIndex: index,
                          contentPath: path,
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
