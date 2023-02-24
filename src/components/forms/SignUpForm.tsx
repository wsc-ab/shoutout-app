import {yupResolver} from '@hookform/resolvers/yup';
import auth, {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Linking, StyleSheet, View} from 'react-native';
import {object} from 'yup';

import {createUser, sendVerificationCode} from '../../functions/User';
import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignUpForm = ({phoneNumber, onCancel}: TProps) => {
  const {text, email} = defaultSchema();

  const schema = object({
    displayName: text({min: 4, max: 20, required: true}),
    email: email({required: true}),
    code: text({min: 6, max: 6, required: true}),
    password: text({min: 8, required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: '',
      email: '',
      code: '',
      password: '',
    },
  });

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

  const onSubmit = async ({
    displayName,
    email: inputEmail,
    password,
    code,
    link,
  }: {
    displayName: string;
    email: string;
    password: string;
    code: string;
    link?: string;
  }) => {
    setIsSubmitting(true);
    const userId = firebase.firestore().collection('users').doc().id;

    try {
      await createUser({
        user: {
          displayName,
          id: userId,
          phoneNumber,
          email: inputEmail,
          password,
          code,
          link,
          countryCode: 'kr',
        },
      });
      await auth().signInWithEmailAndPassword(inputEmail, password);
    } catch (error) {
      if ((error as {message: string}).message === 'display name exists') {
        DefaultAlert({
          title: 'Error',
          message: 'Please use a different ID. This ID has been used',
        });
      } else if ((error as {message: string}).message === 'email exists') {
        DefaultAlert({
          title: 'Error',
          message: 'Please user a different email. This email has been used',
        });
      } else if ((error as {message: string}).message === 'invalid code') {
        DefaultAlert({
          title: 'Error',
          message: 'This code is invalid',
        });
      } else {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
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
        onPress: handleSubmit(onSubmit),
        submitting,
      }}>
      <DefaultKeyboardAwareScrollView>
        <DefaultText title="Please set your profile to sign up." />
        <DefaultDivider />
        <ControllerText
          control={control}
          name="email"
          title="Email"
          autoCapitalize="none"
          placeholder="hello@airballoon.app"
          autoComplete="email"
          keyboardType="email-address"
          errors={errors.email}
          autoFocus
        />
        <ControllerText
          control={control}
          name="password"
          title="Password"
          errors={errors.password}
          autoCapitalize="none"
          autoComplete="password"
          placeholder="keep it a secret"
          secureTextEntry
          style={styles.textInput}
        />
        <ControllerText
          control={control}
          name="displayName"
          title="ID"
          errors={errors.displayName}
          autoCapitalize="none"
          autoComplete="username"
          placeholder="airballoon"
          style={styles.textInput}
        />
        <ControllerText
          control={control}
          name="code"
          title="Code"
          detail="Enter the code sent to your phone."
          errors={errors.code}
          placeholder="000000"
          keyboardType="number-pad"
          autoComplete="sms-otp"
          style={styles.textInput}
        />

        <Terms />
      </DefaultKeyboardAwareScrollView>
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
  textInput: {marginTop: 20},
  terms: {marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'},
});
