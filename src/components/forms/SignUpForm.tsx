import auth, {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {createUser, sendVerificationCode} from '../../functions/User';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignUpForm = ({phoneNumber, onCancel}: TProps) => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [link, setLink] = useState<string>();

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
          link,
          countryCode: 'kr',
        },
      });
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if ((error as {message: string}).message === 'display name exists') {
        Alert.alert('Use a different ID', 'This ID has been used.');
      } else if ((error as {message: string}).message === 'email exists') {
        Alert.alert('Use a different email', 'This email has been used.');
      } else if ((error as {message: string}).message === 'invalid code') {
        Alert.alert('Please retry', 'This code is invalid');
      } else {
        Alert.alert('Please retry', (error as {message: string}).message);
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
      }}>
      <KeyboardAwareScrollView>
        <DefaultText title="Please set your ID to sign up." />
        <View style={styles.divider} />
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
          title="Link"
          detail="A link to your social profile. If set users will navigate to the link when your ID is pressed."
          value={link}
          onChangeText={setLink}
          autoCapitalize="none"
          placeholder="www.airballoon.app"
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
        <Terms />
      </KeyboardAwareScrollView>
    </DefaultForm>
  );
};

export default SignUpForm;

const Terms = () => {
  return (
    <View style={styles.terms}>
      <DefaultText title="By signing up you agree to Airballoon's " />
      <DefaultText
        title={'terms'}
        onPress={async () => {
          await Linking.openURL(
            'https://hello456575.wixsite.com/website/terms',
          );
        }}
      />
      <DefaultText title={' and '} />
      <DefaultText
        title={'privacy policy'}
        onPress={async () => {
          await Linking.openURL(
            'https://hello456575.wixsite.com/website/privacypolicy',
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {marginTop: 10},
  terms: {marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'},
  divider: {borderWidth: 1, borderColor: 'gray', marginVertical: 20},
});