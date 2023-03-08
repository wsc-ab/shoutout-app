import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import {joinChannelWithCode} from '../../functions/Channel';

import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import {localizations} from './ChannelCodeForm.localizations';

type TProps = {onCancel: () => void};

const ChannelCodeForm = ({onCancel}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);

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
    try {
      setSubmitting(true);

      await joinChannelWithCode({
        channel: {code},
      });
      onUpdate(undefined);
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert(localization.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultForm
      title={localization.title}
      left={{onPress: onCancel}}
      right={{
        onPress: handleSubmit(onSubmit),
        submitting,
      }}>
      <DefaultKeyboardAwareScrollView>
        <ControllerText
          control={control}
          {...localization.code}
          name="code"
          autoFocus
          keyboardType="number-pad"
          errors={errors.code}
        />
      </DefaultKeyboardAwareScrollView>
    </DefaultForm>
  );
};

export default ChannelCodeForm;
