import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import {createMoment} from '../../functions/Moment';
import {TLatLng} from '../../types/Firebase';

import {defaultSchema} from '../../utils/Schema';
import ControllerOption from '../controllers/ControllerOption';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';

type TProps = {
  path: string;
  latlng: TLatLng;
  id: string;
};

const CreateMomentForm = ({path, id, latlng}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);

  const schema = object({
    name: text({min: 4, max: 50, required: true}),
    type: text({required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'everyone',
      name: '',
    },
  });

  const onSubmit = async ({
    name,
    type,
  }: {
    name: string;
    type: 'everyone' | 'friends';
  }) => {
    try {
      setSubmitting(true);

      await createMoment({
        moment: {
          id,
          path,
          latlng,
          name,
          type,
        },
      });
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
    } finally {
      setSubmitting(false);
      onUpdate(undefined);
    }
  };

  return (
    <DefaultModal>
      <DefaultForm
        title={'Moment'}
        right={{
          onPress: handleSubmit(onSubmit),
          submitting,
        }}>
        <DefaultKeyboardAwareScrollView>
          <ControllerOption
            control={control}
            name="type"
            title="Type"
            detail="Select friends to share only with friends."
            errors={errors.type}
            options={[
              {name: 'everyone', title: 'Everyone'},
              {name: 'friends', title: 'Friends'},
            ]}
          />
          <ControllerText
            control={control}
            name="name"
            title="Name"
            detail="Set the name of the moment."
            errors={errors.name}
            style={styles.textInput}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateMomentForm;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
