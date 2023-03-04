import {yupResolver} from '@hookform/resolvers/yup';
import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import {createRoom} from '../../functions/Room';

import {defaultSchema} from '../../utils/Schema';
import ControllerOption from '../controllers/ControllerOption';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';

type TProps = {};

const CreateRoomForm = ({}: TProps) => {
  const {text} = defaultSchema();

  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    type: text({required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'open',
      name: '',
    },
  });

  const onSubmit = async ({
    name,
    type,
  }: {
    name: string;
    type: 'open' | 'close';
  }) => {
    try {
      setSubmitting(true);

      const roomId = firebase.firestore().collection('rooms').doc().id;

      await createRoom({
        room: {
          id: roomId,
          type,
          name,
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
        title={'Room'}
        left={{
          onPress: () => onUpdate(undefined),
        }}
        right={{
          onPress: handleSubmit(onSubmit),
          submitting,
        }}>
        <DefaultKeyboardAwareScrollView>
          <ControllerText
            control={control}
            name="name"
            title="Name"
            detail="A short description of your room."
            errors={errors.name}
          />
          <ControllerOption
            control={control}
            name="type"
            title="Type"
            detail="Select close to create a private room with friends."
            errors={errors.type}
            style={styles.textInput}
            options={[
              {name: 'open', title: 'Open'},
              {name: 'close', title: 'Close'},
            ]}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateRoomForm;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
