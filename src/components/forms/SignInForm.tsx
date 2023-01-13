import {yupResolver} from '@hookform/resolvers/yup';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {object} from 'yup';
import {defaultSchema} from '../../utils/Schema';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import FormText from '../defaults/FormText';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignInForm = ({phoneNumber, onCancel}: TProps) => {
  const {text} = defaultSchema();
  const schema = object({
    code: text({min: 6, max: 6, required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: '',
    },
  });
  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const [submitting, setIsSubmitting] = useState(false);

  const onSubmit = async ({code}: {code: string}) => {
    if (!confirm) {
      return;
    }

    try {
      setIsSubmitting(true);
      await confirm.confirm(code);
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
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

      try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

        setConfirm(confirmation);
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    load();
  }, [phoneNumber]);

  return (
    <>
      <DefaultForm
        title={'Sign in'}
        left={{onPress: onCancel}}
        right={{onPress: handleSubmit(onSubmit), submitting}}>
        {confirm && (
          <KeyboardAwareScrollView>
            <DefaultText title="Sign in by entering the code we just sent to your phone." />
            <DefaultDivider />
            <FormText
              control={control}
              name="code"
              title="Code"
              errors={errors.code}
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
