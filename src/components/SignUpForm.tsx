import auth, {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';
import {createUser, sendVerificationCode} from '../functions/User';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignUpForm = ({phoneNumber, onCancel}: TProps) => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  console.log(phoneNumber, 'phoneNumber');

  useEffect(() => {
    const load = async () => {
      if (!phoneNumber) {
        return;
      }
      setIsSubmitting(true);
      await sendVerificationCode({user: {phoneNumber}});

      setIsSubmitting(false);
    };

    if (phoneNumber) {
      load();
    }
  }, [phoneNumber]);

  const onSubmit = async () => {
    if (id.length === 0) {
      return Alert.alert('Please retry', "ID can't be empty");
    }

    if (email.length === 0) {
      return Alert.alert('Please retry', "Email can't be empty");
    }

    if (password.length === 0) {
      return Alert.alert('Please retry', "Password can't be empty");
    }

    setIsSubmitting(true);
    const userId = firebase.firestore().collection('users').doc().id;
    try {
      await createUser({
        user: {
          name: id,
          id: userId,
          phoneNumber,
          email,
          password,
          code,
          countryCode: 'kr',
        },
      });
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.message === 'display name exists') {
        Alert.alert('Use a different ID', 'This ID has been used.');
      } else if (error.message === 'email exists') {
        Alert.alert('Use a different email', 'This email has been used.');
      } else if (error.message === 'invalid code') {
        Alert.alert('Please retry', 'This code is invalid');
      } else {
        Alert.alert('Please retry', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [submitting, setIsSubmitting] = useState(false);

  return (
    <DefaultForm
      title={'Sign Up'}
      left={{
        onPress: onCancel,
      }}
      right={{
        onPress: onSubmit,
        submitting,
      }}
      style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <DefaultText title="Please set your ID to sign up." />

        <View
          style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
        />
        <DefaultTextInput
          title="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="hello@airballoon.app"
          autoComplete="email"
          keyboardType="email-address"
        />
        <DefaultTextInput
          title="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete="password"
          placeholder="keep it a secret"
          secureTextEntry
          style={styles.textInput}
        />
        <DefaultTextInput
          title="ID"
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
          autoComplete="username"
          placeholder="airballoon"
          style={styles.textInput}
        />
        <DefaultTextInput
          title="Code"
          detail="Enter the code we sent to your phone."
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          keyboardType="number-pad"
          autoComplete="sms-otp"
          style={styles.textInput}
          autoFocus
        />
      </KeyboardAwareScrollView>
    </DefaultForm>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({textInput: {marginTop: 10}});
