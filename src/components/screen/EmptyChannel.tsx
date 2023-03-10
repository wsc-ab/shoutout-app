import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {object} from 'yup';
import LanguageContext from '../../contexts/Language';
import {joinChannelWithCode} from '../../functions/Channel';
import {defaultSchema} from '../../utils/Schema';
import SubmitTextButton from '../buttons/SubmitTextButton';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import {localizations} from './EmptyChannel.localizations';

const EmptyChannel = () => {
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

  const onSubmit = async ({code}: {code: string}) => {
    console.log('called join');

    try {
      await joinChannelWithCode({
        channel: {code},
      });
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert(localization.error);
      }
    }
  };

  const onPress = handleSubmit(onSubmit);

  return (
    <View style={styles.container}>
      <DefaultText title={localization.title} textStyle={styles.titleText} />
      <DefaultText title={localization.detail} textStyle={styles.detail} />
      <ControllerText
        control={control}
        title={localization.code}
        name="code"
        autoFocus
        keyboardType="number-pad"
        errors={errors.code}
      />
      <SubmitTextButton
        title={localization.enter}
        textStyle={styles.submitText}
        onPress={onPress}
        style={styles.submit}
      />
    </View>
  );
};

export default EmptyChannel;

const styles = StyleSheet.create({
  container: {flex: 1},
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {marginBottom: 20},
  submit: {alignSelf: 'center', marginTop: 10},
  submitText: {fontSize: 20, fontWeight: 'bold', marginBottom: 5},
});
