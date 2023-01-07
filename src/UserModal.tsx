import React, {useContext} from 'react';
import {Button, Text} from 'react-native';
import AuthUserContext from './AuthUser';
import DefaultModal from './DefaultModal';

type TProps = {
  onCancel: () => void;
};

const UserModal = ({onCancel}: TProps) => {
  const {onSignOut} = useContext(AuthUserContext);
  return (
    <DefaultModal
      title="Me"
      left={{
        title: 'Cancel',
        onPress: onCancel,
      }}>
      <Text>My content of the day</Text>
      <Button title="Sign out" onPress={onSignOut} />
    </DefaultModal>
  );
};

export default UserModal;
