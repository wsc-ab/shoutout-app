import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import FollowButton from '../buttons/FollowButton';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  displayName: string;
  thumbnail?: string;
};

const UserCard = ({id, displayName, thumbnail}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  return (
    <Pressable
      style={styles.container}
      onPress={() => onUpdate({target: 'users', data: {id}})}>
      {thumbnail && (
        <DefaultImage
          image={thumbnail}
          imageStyle={{
            height: 20,
            width: 20,
          }}
        />
      )}
      {!thumbnail && <DefaultIcon icon="user" />}
      <DefaultText title={displayName} style={styles.displayName} />
      <FollowButton
        user={{
          id,
        }}
      />
    </Pressable>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    marginBottom: 10,
  },
  displayName: {marginLeft: 5, flex: 1},
});
