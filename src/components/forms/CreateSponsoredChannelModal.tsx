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
import ControllerDetail from '../controllers/ControllerDetail';
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
    mode: text({required: true}),
    detail: text({min: 10, max: 500, required: true}),
    lurking: text({required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      mode: 'camera',
      detail: '',
      lurking: '7',
    },
  });

  const onSubmit = async ({
    name,
    detail,
    mode,
    lurking,
  }: {
    name: string;
    detail: string;
    mode: 'camera' | 'library' | 'both';
    lurking: 'off' | '1' | '7' | '14';
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
            mode,
            lurking: {mode: lurking},
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
            name="mode"
            title="Mode"
            detail="Use camera mode to allow users to share live videos taken from camera only."
            errors={errors.mode}
            style={styles.textInput}
            options={[
              {name: 'camera', title: 'Camera'},
              {name: 'library', title: 'Library'},
              {name: 'both', title: 'Both'},
            ]}
          />
          <ControllerDetail
            control={control}
            name="detail"
            title="Detail"
            detail="Detail of what's being sponsored."
            errors={errors.detail}
            style={styles.textInput}
          />
          <ControllerOption
            control={control}
            name="lurking"
            title="Block lurking"
            detail="Set the number of allowed lurking days. If set to 7 days, users who haven't posted in the last 7 days will be shown blured images."
            errors={errors.lurking}
            style={styles.textInput}
            options={[
              {name: 'off', title: 'Off'},
              {name: '1', title: '1 Day'},
              {name: '7', title: '7 Days'},
              {name: '14', title: '14 Days'},
            ]}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateSponsoredChannelModal;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
