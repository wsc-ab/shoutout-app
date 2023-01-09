import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

type TProps = {
  phoneNumber: string;
  onCancel: () => void;
};

const SignInForm = ({phoneNumber, onCancel}: TProps) => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const [submitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState('');

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

  useEffect(() => {
    const load = async () => {
      setIsSubmitting(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setIsSubmitting(false);
    };
    load();
  }, [phoneNumber]);

  return (
    <DefaultModal>
      {confirm && (
        <DefaultForm
          title={'Enter Code'}
          left={{title: 'Cancel', onPress: onCancel}}
          right={{title: 'Done', onPress: confirmCode, submitting}}>
          <DefaultText title="Sign in by entering the code we just sent to your phone." />
          <View
            style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
          />

          <DefaultTextInput
            title="Code"
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            keyboardType="number-pad"
            autoComplete="sms-otp"
          />
        </DefaultForm>
      )}
    </DefaultModal>
  );
};

export default SignInForm;
