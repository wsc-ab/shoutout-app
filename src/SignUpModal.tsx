import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import DefaultModal from './DefaultModal';
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
    <DefaultModal
      title={'Create'}
      left={{title: 'Cancel', onPress: onCancel}}
      right={{title: 'Done', onPress: onSubmit}}>
      <View>
        <Text style={{fontSize: 20}}>Create your profile</Text>
        <Text style={{marginTop: 20}}>ID</Text>
        <TextInput
          value={id}
          onChangeText={setId}
          style={styles.textInput}
          autoCapitalize="none"
        />
      </View>
    </DefaultModal>
  );
};

export default SignUpModal;

const styles = StyleSheet.create({
  textInput: {
    marginTop: 5,
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
});
