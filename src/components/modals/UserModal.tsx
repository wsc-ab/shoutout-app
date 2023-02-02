import firebase from '@react-native-firebase/app';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import {TObject} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {groupByLength} from '../../utils/Array';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';
import MomentModal from './MomentModal';

type TProps = {
  id: string;
  onCancel: () => void;
  changeModalVisible: () => void;
};

const UserModal = ({id, onCancel, changeModalVisible}: TProps) => {
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
  const [momentId, setMomentId] = useState<'string'>();

  const {width} = useWindowDimensions();
  const videoWidth = (width - 20) / 3;

  return (
    <DefaultModal>
      {status === 'loading' && !data && (
        <ActivityIndicator style={styles.act} />
      )}
      {data && (
        <DefaultForm title={data.name} left={{onPress: onCancel}}>
          <FlatList
            data={groupByLength(data.contributeTo?.items ?? [], 3)}
            ListEmptyComponent={<DefaultText title="No moments found" />}
            contentContainerStyle={styles.container}
            renderItem={({item}) => {
              return (
                <View style={styles.moments}>
                  {item.map(moment => (
                    <Pressable
                      onPress={() => {
                        setMomentId(moment.id);
                        setModal('moment');
                      }}>
                      <DefaultVideo
                        key={moment.id}
                        path={moment.path}
                        style={[
                          {height: (videoWidth * 4) / 3, width: videoWidth},
                        ]}
                        disabled={true}
                        play={false}
                      />
                      <View style={styles.icons}>
                        <View style={styles.icon}>
                          <DefaultIcon icon="reply" />
                          <DefaultText
                            title={moment.linkFrom.number.toString()}
                          />
                        </View>
                        <View style={styles.icon}>
                          <DefaultIcon icon="heart" />
                          <DefaultText
                            title={moment.likeFrom.number.toString()}
                          />
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.seperator} />}
          />
        </DefaultForm>
      )}
      {modal === 'moment' && data && momentId && (
        <MomentModal
          onCancel={() => setModal(undefined)}
          id={momentId}
          changeModalVisible={changeModalVisible}
        />
      )}
    </DefaultModal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  container: {paddingBottom: 100},
  act: {flex: 1},
  moments: {flexDirection: 'row'},
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seperator: {
    marginBottom: 5,
  },
});
