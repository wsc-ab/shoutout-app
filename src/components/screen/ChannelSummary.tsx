import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupByKey} from '../../utils/Array';
import {checkGhosting, checkSpam} from '../../utils/Channel';
import {getTimeGap} from '../../utils/Date';
import {getThumbnailPath} from '../../utils/Storage';
import CreateMomentButton from '../buttons/CreateMomentButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';
import ChannelDetailModal from '../modals/ChannelDetailModal';
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
  const [modal, setModal] = useState<'detail' | 'info'>();

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
    moment,
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

      onUpdate({
        target: 'channel',
        data: {channel: {...data, groupedMoments}, moment},
      });
    }
  };

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
            <DefaultIcon
              icon="info-circle"
              onPress={() => setModal('info')}
              style={{marginLeft: 10}}
            />
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
            />
          )}
          {data.options.spam && data.options.spam !== 'off' && (
            <DefaultText
              title={`${localization.spam} ${data.options.spam}`}
              style={[styles.tag, spam && {backgroundColor: defaultRed.lv2}]}
              textStyle={{color: spam ? 'black' : 'white'}}
            />
          )}
          {data.options.sponsor?.detail && (
            <DefaultText title={'Sponsor'} style={styles.tag} />
          )}
        </View>
      </View>
      <FlatList
        data={data.moments.items}
        horizontal
        ItemSeparatorComponent={() => <View style={{marginHorizontal: 5}} />}
        renderItem={({item}) => {
          return (
            <View>
              <Pressable
                onPress={() => {
                  if (ghosting) {
                    return DefaultAlert(localization.ghostAlert);
                  }
                  onView({
                    user: {id: item.createdBy.id},
                    moment: {id: item.id},
                  });
                }}>
                <DefaultImage
                  image={getThumbnailPath(
                    item.content.path,
                    item.content.media,
                  )}
                  imageStyle={{
                    borderRadius: 10,
                    height: 150,
                    width: 150,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: defaultBlack.lv2(0.5),
                    padding: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <UserProfileImage
                    user={{
                      id: item.createdBy.id,
                    }}
                    imageStyle={{height: 30, width: 30}}
                  />
                  <View style={{marginLeft: 5, flex: 1}}>
                    <DefaultText
                      title={item.createdBy.displayName}
                      numberOfLines={1}
                      textStyle={{fontWeight: 'bold'}}
                    />
                    <DefaultText title={item.name} numberOfLines={1} />
                  </View>
                </View>
              </Pressable>
              <DefaultText
                title={`${getTimeGap(item.addedAt)} ago`}
                numberOfLines={1}
                textStyle={{fontSize: 14, color: 'gray'}}
                style={{alignSelf: 'flex-end', marginTop: 5}}
              />
            </View>
          );
        }}
      />
      {modal === 'info' && (
        <ChannelDetailModal
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
