import React, {useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
    <Modal presentationStyle="pageSheet">
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
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
        <View style={{flexDirection: 'row'}}>
          {isSubmitting && (
            <>
              <Button title="Done" onPress={onSubmit} />
              <Button title="Cancel" onPress={onCancel} />
            </>
          )}
          {isSubmitting && <ActivityIndicator />}
        </View>
      </KeyboardAwareScrollView>
    </Modal>
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
