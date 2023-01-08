import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';
import {editUser} from '../functions/User1';

type TProps = {
  uid: string;
  onSuccess: () => void;
};

const SignUpModal = ({onSuccess, uid}: TProps) => {
  const [id, setId] = useState('');

  const onSubmit = async () => {
    if (id.length === 0) {
      return Alert.alert('Please retry', "ID can't be empty");
    }

    try {
      setIsSubmitting(true);
      await editUser({user: {name: id, id: uid}});
      onSuccess();
    } catch (error) {
      Alert.alert('Please retry', 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
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
