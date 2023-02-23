import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import FollowButton from '../buttons/FollowButton';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../defaults/UserProfileImage';

type TProps = {
  id: string;
  displayName: string;
};

const UserCard = ({id, displayName}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  return (
    <Pressable
      style={styles.container}
      onPress={() => onUpdate({target: 'users', data: {id}})}>
      <UserProfileImage user={{id}} />
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
    padding: 20,
    borderRadius: 10,
    borderColor: 'gray',
    marginBottom: 10,
  },
  displayName: {marginLeft: 10, flex: 1},
});
