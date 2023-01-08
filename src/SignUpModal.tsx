import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import DefaultForm from './DefaultForm';
import DefaultModal from './DefaultModal';
import DefaultText from './DefaultText';
import DefaultTextInput from './DefaultTextInput';
import {editUser} from './functions/user';

type TProps = {
  uid: string;
  onCancel: () => void;
  onSuccess: () => void;
};

const SignUpModal = ({onSuccess, onCancel, uid}: TProps) => {
  const [id, setId] = useState('');

  const onSubmit = async () => {
    setIsSubmitting(true);
    await editUser({user: {name: id, id: uid}});
    onSuccess();
    setIsSubmitting(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <DefaultModal>
      <DefaultForm
        title={'Sign Up'}
        left={{title: 'Cancel', onPress: onCancel}}
        right={{title: 'Done', onPress: onSubmit}}>
        <DefaultText title="Create your profile" textStyle={{fontSize: 20}} />
        <DefaultText title="ID" style={{marginTop: 20}} />
        <DefaultTextInput
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default SignUpModal;
