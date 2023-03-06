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

const CreateChannelForm = ({}: TProps) => {
  const {text} = defaultSchema();

  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    type: text({required: true}),
    live: text({required: true}),
    sponsor: text({required: true}),
    sponsorDetail: text({max: 500}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'public',
      name: '',
      live: 'off',
      sponsor: 'off',
    },
  });

  const onSubmit = async ({
    name,
    type,
    live,
    sponsor,
    sponsorDetail,
  }: {
    name: string;
    type: 'public' | 'private';
    live: 'on' | 'off';
    sponsor: 'on' | 'off';
    sponsorDetail?: string;
  }) => {
    if (sponsor === 'on' && !sponsorDetail) {
      return DefaultAlert({
        title: 'Error',
        message: 'Sponsor detail is required for sponsored channels.',
      });
    }

    try {
      setSubmitting(true);

      const channelId = firebase.firestore().collection('channels').doc().id;

      await createChannel({
        channel: {
          id: channelId,
          options: {
            media: 'video',
            type,
            live: live === 'on',
            sponsor: sponsorDetail ? {detail: sponsorDetail} : undefined,
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

  const sponsor = watch('sponsor') === 'on';

  console.log(watch('sponsor') === 'on', 'sponsor');

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
            name="type"
            title="Type"
            detail="Set it to prvite to not show moments on discovery."
            errors={errors.type}
            style={styles.textInput}
            options={[
              {name: 'public', title: 'Public'},
              {name: 'private', title: 'Private'},
            ]}
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
          <ControllerOption
            control={control}
            name="sponsor"
            title="Sponsor"
            detail="Turn on sponsor if users are getting rewards."
            errors={errors.sponsor}
            style={styles.textInput}
            options={[
              {name: 'off', title: 'Off'},
              {name: 'on', title: 'On'},
            ]}
          />
          {sponsor && (
            <ControllerText
              control={control}
              name="sponsorDetail"
              title="Sponsor Detail"
              detail="Tell users about the rewards."
              errors={errors.sponsorDetail}
              style={styles.textInput}
            />
          )}
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateChannelForm;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
