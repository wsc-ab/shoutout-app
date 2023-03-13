import React, {useContext, useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {deleteMoment, removeComment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getTimeGap} from '../../utils/Date';
import CommentButton from '../buttons/CommentButton';
import LikeButton from '../buttons/LikeButton';
import SubmitIconButton from '../buttons/SubmitIconButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  moment: {
    id: string;
    content: {path: string};
    name: string;
    createdBy: {id: string};
  };
  index: number;
  length: number;
  style?: TStyleView;
};

const Footer = ({moment, index, length}: TProps) => {
  const fadeAnim = useRef(new Animated.Value(150)).current;
  const {authUserData} = useContext(AuthUserContext);
  const {height} = useWindowDimensions();
  const [top, setTop] = useState(true);

  const onRemove = async ({detail, addedAt}) => {
    try {
      await removeComment({moment, comment: {detail, addedAt}});
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to remove comment'});
    }
  };

  const onDelete = () => {
    const onPress = async () => {
      try {
        await deleteMoment({moment});
      } catch (error) {
        DefaultAlert({title: 'Error', message: 'Failed to remove comment'});
      }
    };

    DefaultAlert({
      title: 'Delete moment?',
      message: "You can't restore this moment once deleted!",
      buttons: [{text: 'No'}, {text: 'Delete', onPress, style: 'destructive'}],
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
        }}
        key={item.addedAt}>
        <UserProfileImage
          user={{
            id: item.user.id,
          }}
        />
        <View
          style={{
            marginLeft: 10,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <DefaultText
              title={item.user.displayName}
              textStyle={{fontWeight: 'bold', fontSize: 18}}
            />
            <DefaultText title={item.detail} />
            <View style={{flexDirection: 'row'}}>
              <DefaultText
                title={`${getTimeGap(item.addedAt)} ago`}
                textStyle={{fontSize: 14, color: 'lightgray'}}
                style={{marginRight: 10}}
              />
            </View>
          </View>
          {item.user.id === authUserData.id && index === 0 && (
            <SubmitIconButton icon="times" onPress={() => onDelete(item)} />
          )}
          {item.user.id === authUserData.id && index !== 0 && (
            <SubmitIconButton
              icon="times"
              onPress={async () => await onRemove(item)}
            />
          )}
        </View>
      </View>
    );
  };

  const [expanded, setExpanded] = useState(false);

  const expandList = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.spring(fadeAnim, {
      toValue: height / 2,
      useNativeDriver: false,
    }).start();
    setExpanded(true);
  };

  const short = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.spring(fadeAnim, {
      toValue: height / 4,
      useNativeDriver: false,
    }).start();
    setExpanded(false);
  };

  const [offset, setOffset] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const topReached = offsetY <= 0;
    setOffset(offsetY);
    const direction = offsetY > offset ? 'down' : 'up';
    if (topReached && direction === 'down') {
      short();
    }

    if (!topReached && direction === 'up') {
      expandList();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Animated.FlatList
        data={[
          {
            detail: moment.name,
            addedAt: moment.createdAt,
            user: moment.createdBy,
          },
          ...(moment?.comments ?? []),
        ]}
        style={{maxHeight: fadeAnim}}
        renderItem={renderItem}
        onScroll={onScroll}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <DefaultIcon
                icon={moment.content.media === 'video' ? 'video' : 'image'}
              />
              <DefaultText
                title={`${index + 1} / ${length}`}
                textStyle={{
                  fontWeight: 'bold',
                }}
                style={{
                  borderRadius: 10,
                  marginLeft: 10,
                }}
              />
              {moment.content.mode === 'camera' && (
                <DefaultText
                  title={'Camera'}
                  textStyle={{
                    fontWeight: 'bold',
                  }}
                  style={{
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                />
              )}
            </View>
          </View>
        )}
      />
      <View style={{flexDirection: 'row', paddingBottom: 24}}>
        <LikeButton moment={moment} style={styles.button} />
        <CommentButton moment={moment} style={{flex: 1}} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  button: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
  },
});
