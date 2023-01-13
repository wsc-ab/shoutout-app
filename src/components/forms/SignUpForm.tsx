import {yupResolver} from '@hookform/resolvers/yup';
import auth, {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Linking, StyleSheet, View} from 'react-native';
import {object} from 'yup';

import {createUser, sendVerificationCode} from '../../functions/User';
import {defaultSchema} from '../../utils/Schema';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultText from '../defaults/DefaultText';
import FormText from '../defaults/FormText';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignUpForm = ({phoneNumber, onCancel}: TProps) => {
  const {text, email, website} = defaultSchema();

  const schema = object({
    id: text({min: 4, max: 10, required: true}),
    email: email({required: true}),
    code: text({min: 6, max: 6, required: true}),
    password: text({min: 8, required: true}),
    link: website({}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: '',
      email: '',
      code: '',
      password: '',
      link: undefined,
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
    id: name,
    email: inputEmail,
    password,
    code,
    link,
  }: {
    id: string;
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
          name,
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
        <FormText
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
        <FormText
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
        <FormText
          control={control}
          name="id"
          title="ID"
          errors={errors.id}
          autoCapitalize="none"
          autoComplete="username"
          placeholder="airballoon"
          style={styles.textInput}
        />
        <FormText
          control={control}
          name="link"
          title="Link"
          errors={errors.link}
          autoCapitalize="none"
          placeholder="https://www.airballoon.app"
          style={styles.textInput}
          optional
        />
        <FormText
          control={control}
          name="code"
          title="Code"
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
  textInput: {marginTop: 10},
  terms: {marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'},
});
