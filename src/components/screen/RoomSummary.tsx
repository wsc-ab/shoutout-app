import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Pressable, useWindowDimensions, View} from 'react-native';
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
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  room: {id: string};
  style?: TStyleView;
};

const RoomSummary = ({room, style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {authUserData} = useContext(AuthUserContext);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        return DefaultAlert({
          title: 'Failed to read data',
          message: 'This room seems to be deleted.',
        });
      }

      const newPrompt = doc.data();

      if (newPrompt) {
        setData(newPrompt);
      }
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get moment data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(room.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [authUserData.id, room.id]);

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
    onUpdate({target: 'room', data: {room: data, path}});

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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          flex: 1,
        }}>
        <DefaultText
          title={data.name}
          textStyle={{fontWeight: 'bold', fontSize: 20}}
          style={{flex: 1, marginBottom: 10}}
        />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {joined && <CreateMomentButton room={{id: data.id}} />}
          {!joined && (
            <DefaultIcon
              icon="square-plus"
              size={20}
              onPress={() =>
                DefaultAlert({
                  title: 'Need to join',
                  message: 'First join this room to share your moments!',
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
          onPress={() => onUpdate({target: 'roomUsers', data: {users, room}})}>
          <DefaultIcon
            icon="user-group"
            style={{padding: 0}}
            size={20}
            color={joined ? defaultRed.lv2 : 'white'}
          />
          <DefaultText title={data.inviteTo.number} style={{marginLeft: 5}} />
        </Pressable>
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
            title="No moment shared yet"
            style={{
              height: 50,
              paddingHorizontal: 10,
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
    </View>
  );
};

export default RoomSummary;
