import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import {joinChannelWithCode} from '../../functions/Channel';

import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';

type TProps = {onCancel: () => void};

const ChannelCodeForm = ({onCancel}: TProps) => {
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
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultForm
      title={'Code'}
      left={{onPress: onCancel}}
      right={{
        onPress: handleSubmit(onSubmit),
        submitting,
      }}>
      <DefaultKeyboardAwareScrollView>
        <ControllerText
          control={control}
          name="code"
          title="Code"
          autoFocus
          detail="Channel invitation code."
          keyboardType="number-pad"
          errors={errors.code}
        />
      </DefaultKeyboardAwareScrollView>
    </DefaultForm>
  );
};

export default ChannelCodeForm;
