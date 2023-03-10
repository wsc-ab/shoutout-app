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
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupByKey, groupByLength} from '../../utils/Array';
import {checkGhosting, checkSpam} from '../../utils/Channel';
import {getTimeGap} from '../../utils/Date';
import {getCityAndCountry} from '../../utils/Map';
import {getThumbnailPath} from '../../utils/Storage';
import CreateMomentButton from '../buttons/CreateMomentButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import DetailModal from '../defaults/DetailModal';
import UserProfileImage from '../images/UserProfileImage';
import EditChannelModal from '../modals/EditChannelModal';
import {localizations} from './ChannelSummary.localizations';

type TProps = {
  channel: {id: string};
  style?: TStyleView;
};

const ChannelSummary = ({channel, style}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const {onUpdate} = useContext(ModalContext);
  const {width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {authUserData} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'detail' | 'setting'>();
  const [modalDetail, setModalDetail] = useState<string>();

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        return;
      }

      const newChanneld = doc.data();

      if (newChanneld) {
        setData(newChanneld);
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

  const onView = ({
    user: {id: userId},
    moment: {id: momentId},
  }: {
    user: {id: string};
    moment: {id: string};
  }) => {
    if (data) {
      const groupedMoments = groupByKey({items: data.moments.items});

      const userIndex = groupedMoments.findIndex(
        item => item[0].createdBy.id === userId,
      );
      groupedMoments.unshift(groupedMoments.splice(userIndex, 1)[0]);
      const momentIndex = groupedMoments[0].findIndex(item => {
        return item.id === momentId;
      });

      onUpdate({
        target: 'channel',
        data: {channel: {...data, groupedMoments}, momentIndex},
      });
    }
  };

  const grouped = groupByLength(data.moments.items, 3);

  const itemWidth = width - 60;

  const getItemLayout = (_: any[] | null | undefined, itemIndex: number) => ({
    length: itemWidth,
    offset: itemWidth * itemIndex,
    index: itemIndex,
  });

  const ghosting = checkGhosting({authUser: authUserData, channel: data});
  const {spam, nextTime} = checkSpam({authUser: authUserData, channel: data});

  const onSpam = () => {
    DefaultAlert(localization.spamAlert(nextTime));
  };

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
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <DefaultText
              title={data.name}
              textStyle={{fontWeight: 'bold', fontSize: 20}}
            />
            {data.createdBy.id === authUserData.id && (
              <DefaultIcon
                icon="cog"
                onPress={() => setModal('setting')}
                style={{marginLeft: 10}}
              />
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {!spam && (
              <CreateMomentButton
                channel={{id: data.id, options: data.options}}
              />
            )}
            {spam && (
              <DefaultIcon icon="square-plus" size={20} onPress={onSpam} />
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
            onPress={() => {
              onUpdate({
                target: 'channelUsers',
                data: {
                  channel: data,
                },
              });
            }}>
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
            title={
              data.options.type === 'private'
                ? localization.private
                : localization.public
            }
            style={styles.tag}
            onPress={() => {
              setModal('detail');
              setModalDetail(
                data.options?.type === 'private'
                  ? localization.privateModal
                  : localization.publicModal,
              );
            }}
          />
          {data.options.mode === 'camera' && (
            <DefaultText
              title={localization.camera}
              style={styles.tag}
              onPress={() => {
                setModal('detail');
                setModalDetail(localization.cameraModal);
              }}
            />
          )}
          {data.options.mode === 'library' && (
            <DefaultText
              title={localization.library}
              style={styles.tag}
              onPress={() => {
                setModal('detail');
                setModalDetail(localization.libraryModal);
              }}
            />
          )}

          {['1', '7', '14'].includes(data.options.ghosting?.mode) && (
            <DefaultText
              title={`${localization.ghosting} ${data.options.ghosting.mode}`}
              style={[
                styles.tag,
                ghosting && {backgroundColor: defaultRed.lv2},
              ]}
              textStyle={{color: ghosting ? 'black' : 'white'}}
              onPress={() => {
                setModal('detail');
                setModalDetail(
                  localization.ghostingModal(data.options.ghosting?.mode),
                );
              }}
            />
          )}
          {data.options.spam && data.options.spam !== 'off' && (
            <DefaultText
              title={`${localization.spam} ${data.options.spam}`}
              style={[styles.tag, spam && {backgroundColor: defaultRed.lv2}]}
              textStyle={{color: spam ? 'black' : 'white'}}
              onPress={() => {
                setModal('detail');
                setModalDetail(localization.spamModal(data.options.spam));
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
        snapToInterval={width - 40}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={getItemLayout}
        ListEmptyComponent={() => (
          <DefaultText
            title={localization.nocontents}
            style={{
              height: 50,
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
                  content: {path, media},
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
                        if (ghosting) {
                          return DefaultAlert(localization.ghostAlert);
                        }
                        onView({user: {id: userId}, moment: {id}});
                      }}>
                      <UserProfileImage user={{id: userId}} />
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
                        image={getThumbnailPath(path, media)}
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
      {modal === 'setting' && (
        <EditChannelModal
          onCancel={() => setModal(undefined)}
          channel={data}
          onSuccess={() => setModal(undefined)}
        />
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
