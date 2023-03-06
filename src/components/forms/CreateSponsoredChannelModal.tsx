import {yupResolver} from '@hookform/resolvers/yup';
import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import {createChannel} from '../../functions/Channel';

import AuthUserContext from '../../contexts/AuthUser';
import {defaultSchema} from '../../utils/Schema';
import ControllerOption from '../controllers/ControllerOption';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';

type TProps = {};

const CreateSponsoredChannelModal = ({}: TProps) => {
  const {text} = defaultSchema();

  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    live: text({required: true}),
    detail: text({min: 10, max: 500, required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      live: 'off',
      detail: '',
    },
  });

  const onSubmit = async ({
    name,
    detail,
    live,
  }: {
    name: string;
    detail: string;
    live: 'on' | 'off';
  }) => {
    try {
      setSubmitting(true);

      const channelId = firebase.firestore().collection('channels').doc().id;

      await createChannel({
        channel: {
          id: channelId,
          options: {
            media: 'video',
            type: 'public',
            live: live === 'on',
            sponsor: {detail},
          },
          name,
        },
        users: {ids: [authUserData.id]},
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
        title={'Channel'}
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
            detail="Name of your channel."
            errors={errors.name}
          />
          <ControllerOption
            control={control}
            name="live"
            title="Live only mode"
            detail="Turn on live to allow users to only upload live videos."
            errors={errors.live}
            style={styles.textInput}
            options={[
              {name: 'off', title: 'Off'},
              {name: 'on', title: 'On'},
            ]}
          />
          <ControllerText
            control={control}
            name="detail"
            title="Detail"
            detail="Detail of what's being sponsored."
            errors={errors.detail}
            style={styles.textInput}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateSponsoredChannelModal;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
