import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';
import {editUser} from '../functions/user';

type TProps = {
  uid: string;
  onSuccess: () => void;
};

const SignUpModal = ({onSuccess, uid}: TProps) => {
  const [id, setId] = useState('');

  const onSubmit = async () => {
    setIsSubmitting(true);
    await editUser({user: {name: id, id: uid}});
    onSuccess();
    setIsSubmitting(true);
  };

  const [submitting, setIsSubmitting] = useState(false);

  return (
    <DefaultModal submitting={submitting}>
      <DefaultForm
        title={'Sign Up'}
        right={{
          title: 'Done',
          onPress: onSubmit,
          submitting,
        }}>
        <DefaultText title="Create your profile to continue." />
        <DefaultTextInput
          title="ID"
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
          placeholder="airballoon"
          style={styles.textInput}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default SignUpModal;

const styles = StyleSheet.create({textInput: {marginTop: 10}});
