import {yupResolver} from '@hookform/resolvers/yup';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {object} from 'yup';
import LanguageContext from '../../contexts/Language';
import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultText from '../defaults/DefaultText';
import {localizations} from './SignInForm.localizations';

type TProps = {
  phoneNumber?: string;
  onCancel: () => void;
};

const SignInForm = ({phoneNumber, onCancel}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
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
        title={localization.title}
        left={{onPress: onCancel}}
        right={{onPress: handleSubmit(onSubmit), submitting}}>
        {confirm && (
          <DefaultKeyboardAwareScrollView>
            <DefaultText
              title={localization.detail}
              style={{marginBottom: 20}}
            />
            <ControllerText
              control={control}
              name="code"
              title={localization.code}
              errors={errors.code}
              placeholder="000000"
              keyboardType="number-pad"
              autoComplete="sms-otp"
              autoFocus
            />
          </DefaultKeyboardAwareScrollView>
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
