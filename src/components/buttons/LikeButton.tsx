import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addLike, removeLike} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  moment: {
    id: string;
    path: string;
    user: {id: string};
    likeFrom: {number: number};
  };
  style?: TStyleView;
};

const LikeButton = ({moment, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [number, setNumber] = useState(moment.likeFrom.number);
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onLike = async () => {
    try {
      setSubmitting(true);
      setLiked(true);
      setNumber(pre => pre + 1);
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
      setNumber(pre => pre - 1);
    } finally {
      setSubmitting(false);
    }
  };

  const onUnlike = async () => {
    try {
      setSubmitting(true);
      setLiked(false);
      setNumber(pre => pre - 1);
      await removeLike({
        moment,
      });
    } catch (error) {
      setLiked(true);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
      setNumber(pre => pre + 1);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setLiked(
      authUserData.likeTo?.items.some(
        ({path}: {path: string}) => path === moment.path,
      ),
    );
  }, [authUserData.likeTo?.items, moment.path]);

  return (
    <View style={[styles.container, style]}>
      <DefaultIcon
        icon="heart"
        onPress={!submitting ? (liked ? onUnlike : onLike) : undefined}
        color={liked ? defaultRed.lv2 : 'white'}
        size={20}
      />
      <DefaultText title={number.toString()} style={{marginLeft: 5}} />
    </View>
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
