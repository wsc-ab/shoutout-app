import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Button, StyleSheet, TextInput} from 'react-native';

function PhoneSignIn() {
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
      await confirm.confirm(code);
    } catch (error) {
      console.log(error);
    }
  }

  const signInWithPhoneNumber = async () => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  };

  if (!confirm) {
    return (
      <>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.textInput}
        />
        <Button title="Send Code" onPress={signInWithPhoneNumber} />
      </>
    );
  }

  return (
    <>
      <TextInput value={code} onChangeText={setCode} style={styles.textInput} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </>
  );
}

export default PhoneSignIn;

const styles = StyleSheet.create({textInput: {padding: 20, borderWidth: 1}});
