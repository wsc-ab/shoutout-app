import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

type TProps = {
  onCancel: () => void;
};

const SignInMoodal = ({onCancel}: TProps) => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const [submitting, setIsSubmitting] = useState(false);

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
      console.log(error, 'e');

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

  return (
    <DefaultModal>
      {!confirm && (
        <DefaultForm
          title={'Enter Phone'}
          left={{title: 'Cancel', onPress: onCancel}}
          right={{
            title: 'Done',
            onPress: signInWithPhoneNumber,
            submitting,
          }}>
          <DefaultText title="Enter phone number to sign in." />
          <DefaultTextInput
            title="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+821064541575"
            keyboardType="phone-pad"
            autoComplete="tel"
            style={styles.textInput}
          />
        </DefaultForm>
      )}
      {confirm && (
        <DefaultForm
          title={'Enter Code'}
          left={{title: 'Cancel', onPress: () => setConfirm(undefined)}}
          right={{title: 'Done', onPress: () => confirmCode(), submitting}}>
          <DefaultText title="We've just sent a code to your phone." />
          <DefaultTextInput
            title="Code"
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            keyboardType="number-pad"
            autoComplete="sms-otp"
            style={styles.textInput}
          />
        </DefaultForm>
      )}
    </DefaultModal>
  );
};

export default SignInMoodal;

const styles = StyleSheet.create({textInput: {marginTop: 10}});
