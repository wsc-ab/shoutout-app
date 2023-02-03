import firebase from '@react-native-firebase/app';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {TLocation, TObject, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {getTimeSinceTimestamp} from '../../utils/Date';
import DeleteButton from '../buttons/DeleteButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  id: string;
  onCancel: () => void;
};

const UserModal = ({id, onCancel}: TProps) => {
  const [data, setData] = useState<TObject>();
  const [status, setStatus] = useState<TStatus>('loading');
  const {authUserData} = useContext(AuthUserContext);

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
  const videoWidth = (width - 20) / 3;

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
          title={data.name}
          left={{
            onPress: onCancel,
          }}>
          <FlatList
            data={data.contributeTo?.items}
            ListEmptyComponent={<DefaultText title="No moments found" />}
            contentContainerStyle={styles.container}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({
              item,
            }: {
              item: {
                id: string;
                path: string;
                addedAt: TTimestamp;
                location?: TLocation;
                user: {id: string};
              };
            }) => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    key={item.path}
                    style={{
                      height: (videoWidth * 4) / 3,
                      width: videoWidth,
                      backgroundColor: defaultBlack.lv3,
                    }}
                    disabled={true}>
                    <DefaultVideo
                      path={item.path}
                      style={[
                        {height: (videoWidth * 4) / 3, width: videoWidth},
                      ]}
                      disabled={true}
                      play={false}
                    />
                  </Pressable>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <View>
                      {item.location && (
                        <DefaultText title={item.location.name} />
                      )}
                      <DefaultText
                        title={getTimeSinceTimestamp(item.addedAt)}
                      />
                      <DefaultText title="" />
                    </View>
                    {item.user.id === authUserData.id && (
                      <DeleteButton
                        item={item}
                        style={styles.delete}
                        onSuccess={() => setStatus('loading')}
                      />
                    )}
                  </View>
                </View>
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
  delete: {paddingTop: 0},
});
