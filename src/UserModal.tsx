import React from 'react';
import {Text} from 'react-native';
import DefaultModal from './DefaultModal';

type TProps = {
  onCancel: () => void;
};

const UserModal = ({onCancel}: TProps) => {
  return (
    <DefaultModal
      title="Me"
      left={{
        title: 'Cancel',
        onPress: onCancel,
      }}>
      <Text>My content of the day</Text>
    </DefaultModal>
  );
};

export default UserModal;
