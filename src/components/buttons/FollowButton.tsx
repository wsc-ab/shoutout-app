import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addFollow, removeFollow} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import {getFriendStatus} from '../../utils/Array';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  user: {
    id: string;
  };
  style?: TStyleView;
};

const FollowButton = ({user, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);

  const isAuthUser = user.id === authUserData.id;

  const status = getFriendStatus({
    fromIds: authUserData.followFrom.ids,
    toIds: authUserData.followTo.ids,
    id: user.id,
  });
  const onFollow = async () => {
    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  const onUnfollow = () => {
    const onPress = async () => {
      try {
        setSubmitting(true);
        await removeFollow({user});
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      } finally {
        setSubmitting(false);
      }
    };

    DefaultAlert({
      title: 'Are you sure?',
      message: "You won't get updates from this user.",
      buttons: [
        {text: 'No'},
        {text: 'Unfriend', onPress, style: 'destructive'},
      ],
    });
  };

  return (
    <View style={[styles.container, style]}>
      {isAuthUser && <DefaultText title="Me" />}
      {!isAuthUser && status === 'fromTo' && !submitting && (
        <DefaultText title="Friend" onPress={onUnfollow} />
      )}
      {!isAuthUser && status === 'from' && !submitting && (
        <DefaultText title="Accept" onPress={onFollow} />
      )}
      {!isAuthUser && status === 'to' && !submitting && (
        <DefaultText title="Requested" onPress={onUnfollow} />
      )}
      {!isAuthUser && status === 'none' && !submitting && (
        <DefaultText title="Request" onPress={onFollow} />
      )}
      {submitting && <ActivityIndicator />}
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
});
