import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignInForm = ({phoneNumber, onCancel}: TProps) => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const [submitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState('');

  const confirmCode = async () => {
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
  };

  useEffect(() => {
    const load = async () => {
      if (!phoneNumber) {
        console.log('retuern called');
        return;
      }

      setIsSubmitting(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setIsSubmitting(false);
    };
    load();
  }, [phoneNumber]);

  return (
    <>
      {confirm && (
        <DefaultForm
          title={'Enter Code'}
          left={{onPress: onCancel}}
          right={{onPress: confirmCode, submitting}}
          style={{flex: 1}}>
          <KeyboardAwareScrollView>
            <DefaultText title="Sign in by entering the code we just sent to your phone." />
            <View
              style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
            />

            <DefaultTextInput
              title="Code"
              detail="Enter the code we sent to your phone."
              value={code}
              onChangeText={setCode}
              placeholder="000000"
              keyboardType="number-pad"
              autoComplete="sms-otp"
              autoFocus
            />
          </KeyboardAwareScrollView>
        </DefaultForm>
      )}
    </>
  );
};

export default SignInForm;
