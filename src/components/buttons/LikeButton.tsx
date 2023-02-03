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

  const onLike = async () => {
    try {
      setIsLiked(true);
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
      setIsLiked(false);
    }
  };

  const onUnlike = async () => {
    try {
      setIsLiked(false);
      await removeLike({
        moment,
      });
    } catch (error) {
      setIsLiked(true);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    }
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      authUserData.likeTo?.items.some(
        ({path}: {path: string}) => path === moment.path,
      ),
    );
  }, [authUserData.likeTo?.items, moment.path]);

  return (
    <View style={[styles.container, style]}>
      <DefaultIcon
        icon="heart"
        onPress={isLiked ? onUnlike : onLike}
        color={isLiked ? defaultRed.lv1 : 'white'}
        size={25}
      />
      <DefaultText title={moment.likeFrom.number.toString()} />
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
