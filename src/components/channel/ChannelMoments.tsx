import React, {useCallback, useContext, useEffect} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import NotificationContext from '../../contexts/Notification';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupArrayByUser} from '../../utils/Array';
import {checkGhosting} from '../../utils/Channel';
import {getTimeGap} from '../../utils/Date';
import {getThumbnailPath} from '../../utils/Storage';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';
import {localizations} from './Channel.localizations';

type TProps = {
  channel: TDocData;
  style?: TStyleView;
};

const ChannelMoments = ({channel, style}: TProps) => {
  const {language} = useContext(LanguageContext);
  const {notification, onReset} = useContext(NotificationContext);
  const localization = localizations[language];
  const {authUserData} = useContext(AuthUserContext);
  const ghosting = checkGhosting({authUser: authUserData, channel});
  const {onUpdate} = useContext(ModalContext);

  const onPress = useCallback(
    ({
      user: {id: userId},
      moment,
    }: {
      user: {id: string};
      moment: {id: string};
    }) => {
      const groupedMoments = groupArrayByUser({
        items: channel.moments.items,
      });

      const userIndex = groupedMoments.findIndex(
        item => item[0].createdBy.id === userId,
      );

      groupedMoments.unshift(groupedMoments.splice(userIndex, 1)[0]);

      console.log('called');

      onUpdate({
        target: 'channel',
        data: {channel: {...channel, groupedMoments}, moment},
      });
    },
    [channel, onUpdate],
  );

  useEffect(() => {
    if (
      notification?.data?.collection === 'channels' &&
      notification?.data?.id === channel.id &&
      notification?.data?.momentId
    ) {
      const createdById = channel.moments.items.filter(
        ({id: elId}: {id: string}) => elId === notification?.data?.momentId,
      )[0].createdBy.id;

      onPress({
        user: {id: createdById},
        moment: {id: notification?.data?.momentId as string},
      });
      onReset();
    }
  }, [channel, notification, onPress, onReset]);

  return (
    <FlatList
      data={channel.moments.items}
      style={style}
      horizontal
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({item}) => {
        const anonymousIndex =
          channel.inviteTo.items.findIndex(
            ({id: elId}: {id: string}) => elId === item.user.id,
          ) + 1;
        return (
          <View>
            <Pressable
              onPress={() => {
                if (ghosting) {
                  return DefaultAlert(localization.ghostAlert);
                }
                onPress({
                  user: {id: item.createdBy.id},
                  moment: {id: item.id},
                });
              }}>
              <DefaultImage
                image={getThumbnailPath(item.content.path, item.content.media)}
                imageStyle={styles.image}
              />
              <Pressable
                style={styles.user}
                onPress={
                  channel.options.anonymous === 'off'
                    ? () =>
                        onUpdate({
                          target: 'user',
                          data: {user: {id: item.createdBy.id}},
                        })
                    : undefined
                }>
                <View>
                  {channel.options.anonymous === 'off' && (
                    <UserProfileImage
                      user={{
                        id: item.createdBy.id,
                      }}
                      imageStyle={styles.userImage}
                    />
                  )}
                </View>
                <View style={styles.userDisplayName}>
                  <DefaultText
                    title={
                      channel.options.anonymous === 'on'
                        ? localization.anonymous + anonymousIndex
                        : item.createdBy.displayName
                    }
                    numberOfLines={1}
                    textStyle={styles.displayNameText}
                  />
                  <DefaultText title={item.name} numberOfLines={1} />
                </View>
              </Pressable>
            </Pressable>
            <DefaultText
              title={`${getTimeGap(item.addedAt)} ago`}
              numberOfLines={1}
              textStyle={styles.timeText}
              style={styles.time}
            />
          </View>
        );
      }}
    />
  );
};

export default ChannelMoments;

const styles = StyleSheet.create({
  separator: {marginHorizontal: 5},
  image: {
    borderRadius: 10,
    height: 150,
    width: 150,
  },
  user: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: defaultBlack.lv2(0.5),
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  userImage: {height: 30, width: 30},
  userDisplayName: {marginLeft: 5, flex: 1},
  displayNameText: {fontWeight: 'bold'},
  time: {alignSelf: 'flex-end', marginTop: 5},
  timeText: {fontSize: 14, color: 'gray'},
});
