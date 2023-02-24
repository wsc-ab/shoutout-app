import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {TStyleView} from '../../types/Style';
import FollowButton from '../buttons/FollowButton';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../defaults/UserProfileImage';

type TProps = {
  id: string;
  displayName: string;
  onPress?: (id: string) => void;
  style?: TStyleView;
};

const UserCard = ({id, displayName, style, onPress}: TProps) => {
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress ? () => onPress(id) : undefined}>
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
