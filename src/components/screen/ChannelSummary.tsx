import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupByLength} from '../../utils/Array';
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

const Channelsummary = ({channel, style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {authUserData} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'detail'>();
  const [modalDetail, setModalDetail] = useState<string>();

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        return DefaultAlert({
          title: 'Failed to read data',
          message: 'This channel seems to be deleted.',
        });
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

  const users =
    data.inviteTo?.items?.map(elItem => ({
      ...elItem,
      moment: data.moments.items.filter(
        ({user: {id: elId}}) => elId === elItem.id,
      )[0],
    })) ?? [];

  const onView = ({path}: {path: string}) =>
    onUpdate({target: 'channel', data: {channel: data, path}});

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
            style={{flex: 1, marginLeft: 10}}
          />
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {joined && (
              <CreateMomentButton
                channel={{id: data.id, live: data.options?.live}}
              />
            )}
            {!joined && (
              <DefaultIcon
                icon="square-plus"
                size={20}
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
        <View
          style={{flexDirection: 'row', marginHorizontal: 10, marginTop: 5}}>
          <DefaultText
            title={data.options?.type === 'private' ? 'Private' : 'Public'}
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
          {data.options?.live && (
            <DefaultText
              title={'Live only'}
              style={styles.tag}
              onPress={() => {
                setModal('detail');
                setModalDetail(
                  'This channel only allows moments taken from camera to be shared.',
                );
              }}
            />
          )}
          {data.options?.sponsor?.detail && (
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
              paddingHorizontal: 20,
              width: itemWidth,
            }}
          />
        )}
        renderItem={({item}) => {
          return (
            <View>
              {item.map(
                ({
                  name,
                  path,
                  location,
                  addedAt,
                  user: {id: userId, displayName},
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
                        onView({path});
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

export default Channelsummary;

const styles = StyleSheet.create({
  tag: {
    backgroundColor: 'gray',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 5,
  },
});
