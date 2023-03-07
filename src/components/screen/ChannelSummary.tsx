import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupByKey, groupByLength} from '../../utils/Array';
import {getTimeGap} from '../../utils/Date';
import {getCityAndCountry} from '../../utils/Map';
import {getThumbnailPath} from '../../utils/Storage';
import CreateMomentButton from '../buttons/CreateMomentButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import DetailModal from '../defaults/DetailModal';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  channel: {id: string};
  style?: TStyleView;
};

const ChannelSummary = ({channel, style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {authUserData} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'detail'>();
  const [modalDetail, setModalDetail] = useState<string>();

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        return;
      }

      const newPrompt = doc.data();

      if (newPrompt) {
        setData(newPrompt);
      }
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get channel data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('channels')
      .doc(channel.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [authUserData.id, channel.id]);

  if (!data) {
    return null;
  }

  const users = data.inviteTo?.items;

  const onView = ({id}: {id: string}) => {
    if (data) {
      const groupedMoments = groupByKey({items: data.moments.items});
      console.log(groupedMoments, 'groupedMoments');
      const userIndex = groupedMoments.findIndex(item => item[0].id === id);
      groupedMoments.unshift(groupedMoments.splice(userIndex, 1)[0]);
      const momentIndex = groupedMoments[userIndex].findIndex(
        item => item.id === id,
      );

      groupedMoments[userIndex].unshift(
        groupedMoments[userIndex].splice(momentIndex, 1)[0],
      );

      onUpdate({
        target: 'channel',
        data: {channel: {...data, groupedMoments}},
      });
    }
  };

  const grouped = groupByLength(data.moments.items, 3);

  const itemWidth = width - 20;

  const joined = data.inviteTo.items.some(
    ({id: elId}) => elId === authUserData.id,
  );

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: itemWidth,
    offset: itemWidth * itemIndex,
    index: itemIndex,
  });

  return (
    <View style={style}>
      <View style={{marginBottom: 10}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <DefaultText
            title={data.name}
            textStyle={{fontWeight: 'bold', fontSize: 20}}
            style={{flex: 1}}
          />
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {joined && (
              <CreateMomentButton
                channel={{id: data.id, mode: data.options?.mode}}
              />
            )}
            {!joined && (
              <DefaultIcon
                icon="square-plus"
                size={20}
                color="gray"
                onPress={() =>
                  DefaultAlert({
                    title: 'Need to join',
                    message: 'First join this channel to share your moments!',
                  })
                }
              />
            )}

            <DefaultText
              title={data.moments.number.toString()}
              style={{marginLeft: 5}}
            />
          </View>
          <Pressable
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: 10,
            }}
            onPress={() =>
              onUpdate({
                target: 'channelUsers',
                data: {users, channel: {id: data.id, code: data.code}},
              })
            }>
            <DefaultIcon
              icon="user-group"
              style={{padding: 0}}
              size={20}
              color={'white'}
            />
            <DefaultText title={data.inviteTo.number} style={{marginLeft: 5}} />
          </Pressable>
        </View>
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <DefaultText
            title={data.options.type === 'private' ? 'Private' : 'Public'}
            style={styles.tag}
            onPress={() => {
              setModal('detail');
              setModalDetail(
                data.options?.type === 'private'
                  ? "Moments in this channel won't be shown on the discovery tab."
                  : 'Moments in this channel will be shown on the discovery tab.',
              );
            }}
          />
          {data.options.mode === 'camera' && (
            <DefaultText
              title={'Camera'}
              style={styles.tag}
              onPress={() => {
                setModal('detail');
                setModalDetail(
                  'This channel only allows moments taken from camera to be shared.',
                );
              }}
            />
          )}
          {data.options.mode === 'library' && (
            <DefaultText
              title={'Library'}
              style={styles.tag}
              onPress={() => {
                setModal('detail');
                setModalDetail(
                  'This channel only allows moments from media library to be uploaded.',
                );
              }}
            />
          )}
          {data.options.sponsor?.detail && (
            <DefaultText
              title={'Sponsor'}
              style={styles.tag}
              onPress={() => {
                setModal('detail');
                setModalDetail(data.options?.sponsor?.detail);
              }}
            />
          )}
        </View>
      </View>
      <FlatList
        data={grouped[0].length === 0 ? [] : grouped}
        horizontal
        snapToInterval={width}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={getItemLayout}
        ListEmptyComponent={() => (
          <DefaultText
            title="No moments in this channel."
            style={{
              height: 50,
              // paddingHorizontal: 20,
              width: itemWidth,
            }}
          />
        )}
        renderItem={({item}) => {
          return (
            <View>
              {item.map(
                ({
                  id,
                  name,
                  location,
                  addedAt,
                  content: {path},
                  createdBy: {id: userId, displayName},
                }) => {
                  return (
                    <Pressable
                      key={path}
                      style={{
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        width: itemWidth,
                        height: 50,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        onView({id});
                      }}>
                      <UserProfileImage
                        user={{id: userId}}
                        onPress={() => {
                          onUpdate({target: 'user', data: {id: userId}});
                        }}
                      />
                      <View style={{marginLeft: 10, flex: 1}}>
                        <DefaultText
                          title={displayName}
                          textStyle={{fontWeight: 'bold', fontSize: 16}}
                        />
                        <DefaultText title={name} />

                        <DefaultText
                          title={`${getTimeGap(
                            addedAt,
                          )} ago - ${getCityAndCountry(location.formatted)}`}
                          textStyle={{fontSize: 14, color: 'gray'}}
                        />
                      </View>
                      <DefaultImage
                        image={getThumbnailPath(path, 'video')}
                        imageStyle={{
                          height: 50,
                          width: 50,
                        }}
                      />
                    </Pressable>
                  );
                },
              )}
            </View>
          );
        }}
      />
      {modal === 'detail' && modalDetail && (
        <DetailModal
          title="Detail"
          onCancel={() => {
            setModal(undefined);
            setModalDetail(undefined);
          }}>
          <Text style={{color: 'white', marginHorizontal: 10}}>
            {modalDetail}
          </Text>
        </DetailModal>
      )}
    </View>
  );
};

export default ChannelSummary;

const styles = StyleSheet.create({
  tag: {
    backgroundColor: 'gray',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 5,
  },
});
