import auth, {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';
import {createUser, sendVerificationCode} from '../functions/User';

type TProps = {
  phoneNumber: string;
  onCancel: () => void;
};

const SignUpForm = ({phoneNumber, onCancel}: TProps) => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsSubmitting(true);
      await sendVerificationCode({user: {phoneNumber}});

      setIsSubmitting(false);
    };
    load();
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
        title: 'Cancel',
        onPress: onCancel,
      }}
      right={{
        title: 'Done',
        onPress: onSubmit,
        submitting,
      }}>
      <DefaultText title="Please set your ID to sign up." />

      <View style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}} />
      <DefaultTextInput
        title="email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="airballoon"
        autoComplete="email"
        keyboardType="email-address"
      />
      <DefaultTextInput
        title="password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoComplete="password"
        secureTextEntry
        style={styles.textInput}
      />
      <DefaultTextInput
        title="ID"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
        placeholder="airballoon"
        style={styles.textInput}
      />
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
  );
};

export default SignUpForm;

const styles = StyleSheet.create({textInput: {marginTop: 10}});
