import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
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
        return;
      }

      setIsSubmitting(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('called');

      setConfirm(confirmation);
      setIsSubmitting(false);
    };
    load();
  }, [phoneNumber]);

  return (
    <>
      <DefaultForm
        title={'Enter Code'}
        left={{onPress: onCancel}}
        right={{onPress: confirmCode, submitting}}
        style={{flex: 1}}>
        {confirm && (
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
        )}
        {!confirm && <ActivityIndicator style={styles.act} />}
      </DefaultForm>
    </>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  act: {flex: 1},
});
