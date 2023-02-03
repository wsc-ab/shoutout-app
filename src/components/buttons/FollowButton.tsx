import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addFollow, removeFollow} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  user: {
    id: string;
  };
  style?: TStyleView;
};

const FollowButton = ({user, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const onFollow = async () => {
    try {
      setFollowed(true);
      await addFollow({user});
    } catch (error) {
      if ((error as {message: string}).message === "user doesn't exist") {
        DefaultAlert({
          title: 'Deleted user',
        });
      } else {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      setFollowed(false);
    }
  };

  const onUnfollow = async () => {
    try {
      setFollowed(false);
      await removeFollow({user});
    } catch (error) {
      setFollowed(true);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    }
  };

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setFollowed(authUserData.followTo.ids.includes(user.id));
  }, [authUserData.followTo.ids, user.id]);

  return (
    <View style={[styles.container, style]}>
      {user.id === authUserData.id && (
        <DefaultIcon icon={'check'} style={styles.icon} />
      )}
      {user.id !== authUserData.id && (
        <DefaultIcon
          icon={followed ? 'check' : 'plus'}
          onPress={followed ? onUnfollow : onFollow}
          style={styles.icon}
        />
      )}
    </View>
  );
};

export default FollowButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {padding: 0},
});
