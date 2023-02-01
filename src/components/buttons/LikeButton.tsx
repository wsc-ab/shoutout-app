import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addLike, removeLike} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {collection: string; id: string; style?: TStyleView};

const LikeButton = ({collection, id, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [isLoading, setIsLoading] = useState(false);

  const onLike = async () => {
    try {
      setIsLoading(true);

      setIsLiked(true);
      await addLike({content: {id}});
    } catch (error) {
      if ((error as {message: string}).message === "content doesn't exist") {
        DefaultAlert({
          title: 'Deleted content',
        });
      } else {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      setIsLiked(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnlike = async () => {
    try {
      setIsLoading(true);

      setIsLiked(false);
      await removeLike({
        content: {id},
      });
    } catch (error) {
      setIsLiked(false);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(authUserData.likeTo?.[collection]?.ids.includes(id));
  }, [authUserData.likeTo, collection, id]);

  return (
    <View style={style}>
      {!isLoading && (
        <DefaultIcon
          icon="heart"
          onPress={isLiked ? onUnlike : onLike}
          color={isLiked ? defaultRed.lv1 : 'white'}
        />
      )}
      {isLoading && <ActivityIndicator style={styles.act} />}
    </View>
  );
};

export default LikeButton;

const styles = StyleSheet.create({
  act: {paddingHorizontal: 10},
});
