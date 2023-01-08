import React, {useContext} from 'react';
import {Button} from 'react-native';
import AuthUserContext from './AuthUser';
import DefaultModal from './DefaultModal';
import DefaultText from './DefaultText';

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
      <DefaultText title="My content of the day" />
      <Button title="Sign out" onPress={onSignOut} />
    </DefaultModal>
  );
};

export default UserModal;
