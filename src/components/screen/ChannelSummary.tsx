import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupByKey} from '../../utils/Array';
import {checkGhosting, checkSpam} from '../../utils/Channel';
import {getTimeGap} from '../../utils/Date';
import CreateMomentButton from '../buttons/CreateMomentButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
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

  const onView = ({user: {id: userId}}: {user: {id: string}}) => {
    if (data) {
      const groupedMoments = groupByKey({items: data.moments.items});

      const userIndex = groupedMoments.findIndex(
        item => item[0].createdBy.id === userId,
      );
      groupedMoments.unshift(groupedMoments.splice(userIndex, 1)[0]);

      onUpdate({
        target: 'channel',
        data: {channel: {...data, groupedMoments}},
      });
    }
  };

  const ghosting = checkGhosting({authUser: authUserData, channel: data});
  const {spam, nextTime} = checkSpam({authUser: authUserData, channel: data});

  const onSpam = () => {
    DefaultAlert(localization.spamAlert(nextTime));
  };

  const getLastAddedAt = ({id}: {id: string}) => {
    const lastAddedAt = data.moments.items.filter(
      ({createdBy: {id: elId}}) => elId === id,
    )[0]?.addedAt;

    return lastAddedAt;
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
        data={data.inviteTo.items}
        horizontal
        renderItem={({item}) => {
          const lastAddedAt = getLastAddedAt({id: item.id});

          if (!lastAddedAt) {
            return null;
          }
          return (
            <Pressable
              style={{
                padding: 10,
                flexDirection: 'row',
              }}
              onPress={() => {
                if (ghosting) {
                  return DefaultAlert(localization.ghostAlert);
                }
                onView({user: {id: item.id}});
              }}>
              <UserProfileImage user={{id: item.id}} />
              <View style={{marginLeft: 10}}>
                <DefaultText
                  title={item.displayName}
                  textStyle={{fontWeight: 'bold'}}
                />
                {lastAddedAt && (
                  <DefaultText title={`${getTimeGap(lastAddedAt)} ago`} />
                )}
              </View>
            </Pressable>
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
