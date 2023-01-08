import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Alert, TextInput} from 'react-native';
import DefaultForm from './DefaultForm';
import DefaultModal from './DefaultModal';
import DefaultTextInput from './DefaultTextInput';

type TProps = {
  onCancel: () => void;
};

const SignInMoodal = ({onCancel}: TProps) => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  async function confirmCode() {
    if (!confirm) {
      return;
    }

    try {
      setIsSubmitting(true);
      await confirm.confirm(code);
    } catch (error) {
      Alert.alert('Please retry', 'Invalid code');
    } finally {
      setIsSubmitting(false);
    }
  }

  const signInWithPhoneNumber = async () => {
    setIsSubmitting(true);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    setIsSubmitting(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <DefaultModal>
      {!confirm && (
        <DefaultForm
          title={'Enter Phone'}
          left={{title: 'Cancel', onPress: onCancel}}
          right={{title: 'Done', onPress: signInWithPhoneNumber}}>
          <DefaultTextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone number"
          />
        </DefaultForm>
      )}
      {confirm && (
        <DefaultForm
          title={'Enter Code'}
          left={{title: 'Cancel', onPress: () => setConfirm(undefined)}}
          right={{title: 'Done', onPress: () => confirmCode()}}>
          <DefaultTextInput
            value={code}
            onChangeText={setCode}
            placeholder="6 Digit Code"
          />
        </DefaultForm>
      )}
    </DefaultModal>
  );
};

export default SignInMoodal;
