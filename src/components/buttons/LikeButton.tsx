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

  const onLike = async () => {
    try {
      setLiked(true);
      setNumber(pre => pre + 1);
      const {
        moment: {
          likeFrom: {number: newNumber},
        },
      } = await addLike({moment});
      setNumber(newNumber);
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
      setNumber(moment.likeFrom.number);
    }
  };

  const onUnlike = async () => {
    try {
      setLiked(false);
      setNumber(pre => pre - 1);
      const {
        moment: {
          likeFrom: {number: newNumber},
        },
      } = await removeLike({
        moment,
      });
      setNumber(newNumber);
    } catch (error) {
      setLiked(true);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
      setNumber(moment.likeFrom.number);
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
        onPress={liked ? onUnlike : onLike}
        color={liked ? defaultRed.lv1 : 'white'}
        size={25}
      />
      <DefaultText title={number.toString()} />
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
