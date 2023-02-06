import {firebase} from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import DefaultAlert from '../components/defaults/DefaultAlert';
import DefaultForm from '../components/defaults/DefaultForm';
import DefaultModal from '../components/defaults/DefaultModal';
import DefaultText from '../components/defaults/DefaultText';
import RollModal from '../components/modals/RollModal';
import ContentCard from '../components/screen/ContentCard';

import {TDocData, TLocation, TTimestamp} from '../types/Firebase';
import {TStatus} from '../types/Screen';
import ModalContext from './Modal';

type TContextProps = {
  onUpdate: (user: {id: string}) => void;
  user?: {id: string};
};

const UserModalContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const UserModalProvider = ({children}: TProps) => {
  const [user, setUser] = useState<{id: string}>();
  const [data, setData] = useState<TDocData>();
  const [status, setStatus] = useState<TStatus>('loading');
  const [modal, setModal] = useState<'roll'>();
  const [rollId, setRollId] = useState<string>();
  const {onUpdate: onUpdateModal} = useContext(ModalContext);

  const {width} = useWindowDimensions();
  const videoWidth = (width - 10) / 3;
  const videoHeight = (videoWidth * 4) / 3;

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user) {
        return;
      }
      try {
        const userData = (
          await firebase.firestore().collection('users').doc(user.id).get()
        ).data();
        console.log(userData, 'userData');

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
  }, [status, user]);

  const onUpdate = (newUser: {id: string}) => {
    setModal(undefined);
    setRollId(undefined);

    setUser(newUser);
    onUpdateModal('user');

    setStatus('loading');
  };

  return (
    <UserModalContext.Provider
      value={{
        user,
        onUpdate,
      }}>
      {children}
      {data && (
        <DefaultModal style={{zIndex: 200}}>
          {status === 'loading' && !data && (
            <ActivityIndicator style={styles.act} />
          )}
          {data && (
            <DefaultForm
              title={data.displayName}
              left={{
                onPress: () => {
                  setUser(undefined);
                  setData(undefined);
                },
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
                      content={{...item, user: {id: data.id}}}
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
      )}
    </UserModalContext.Provider>
  );
};

export {UserModalProvider};
export default UserModalContext;

const styles = StyleSheet.create({
  container: {paddingBottom: 100},
  act: {flex: 1},
  seperator: {
    marginBottom: 20,
  },
});
