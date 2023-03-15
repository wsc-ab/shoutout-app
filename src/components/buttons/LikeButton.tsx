import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addLike, removeLike} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
};

const LikeButton = ({moment, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onLike = async () => {
    try {
      setSubmitting(true);
      setLiked(true);

      await addLike({moment});
    } catch (error) {
      if ((error as {message: string}).message === "moment doesn't exist") {
        DefaultAlert({
          title: 'Deleted moment',
        });
      } else {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      setLiked(false);
    } finally {
      setSubmitting(false);
    }
  };

  const onUnlike = async () => {
    try {
      setSubmitting(true);
      setLiked(false);

      await removeLike({
        moment,
      });
    } catch (error) {
      setLiked(true);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setLiked(
      authUserData.likeTo?.items.some(({id}: {id: string}) => id === moment.id),
    );
  }, [authUserData.likeTo?.items, moment.id]);

  return (
    <DefaultIcon
      style={[styles.container, style]}
      icon="heart"
      onPress={!submitting ? (liked ? onUnlike : onLike) : undefined}
      color={liked ? defaultRed.lv2 : 'white'}
      size={20}
    />
  );
};

export default LikeButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
