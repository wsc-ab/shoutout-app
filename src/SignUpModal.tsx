import React, {useState} from 'react';
import {Modal, Pressable, Text, TextInput} from 'react-native';
import {editUser} from './functions/user';

type TProps = {
  uid: string;
  onCancel: () => void;
  onSuccess: () => void;
};

const SignUpModal = ({onSuccess, onCancel, uid}: TProps) => {
  const [id, setId] = useState('');

  const onSubmit = async () => {
    console.log({name: id, id: uid});

    await editUser({user: {name: id, id: uid}});
    onSuccess();
  };

  return (
    <Modal presentationStyle="pageSheet">
      <Text>Update</Text>
      <Text>ID</Text>
      <TextInput value={id} onChangeText={setId} />
      <Pressable onPress={onSubmit}>
        <Text>Done</Text>
      </Pressable>
      <Pressable onPress={onCancel}>
        <Text>Cancel</Text>
      </Pressable>
    </Modal>
  );
};

export default SignUpModal;
