import {yupResolver} from '@hookform/resolvers/yup';
import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import {createChannel} from '../../functions/Channel';

import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import {defaultSchema} from '../../utils/Schema';
import ControllerDetail from '../controllers/ControllerDetail';
import ControllerOption from '../controllers/ControllerOption';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';
import {localizations} from './CreateGeneralChannelModal.localizations';

type TProps = {};

const CreateGeneralChannelModal = ({}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const {text, number} = defaultSchema();

  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    detail: text({required: true}),
    type: text({required: true}),
    mode: text({required: true}),
    ghosting: text({required: true}),
    spam: text({required: true}),
    anonymous: text({required: true}),
    notificationHours: number({min: 0, max: 23}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      detail: '',
      type: 'public',
      mode: 'both',
      ghosting: '7',
      spam: '1',
      anonymous: 'off',
      notificationHours: 'off',
    },
  });

  const onSubmit = async ({
    name,
    detail,
    type,
    mode,
    ghosting,
    spam,
    anonymous,
    notificationHours,
  }: {
    name: string;
    detail: string;
    type: 'public' | 'private';
    mode: 'camera' | 'library' | 'both';
    ghosting: 'off' | '1' | '7' | '14';
    spam: 'off' | '1' | '3' | '6' | '12' | '24';
    anonymous: 'off' | 'on';
    notificationHours: string | undefined;
  }) => {
    try {
      setSubmitting(true);

      const channelId = firebase.firestore().collection('channels').doc().id;

      let notification;

      if (notificationHours !== 'off') {
        const now = new Date();
        now.setHours(parseInt(notificationHours, 10));
        now.getUTCHours();
        notification = {
          hours: [now.getUTCHours()],
          days: [0, 1, 2, 3, 4, 5, 6],
        };
      }

      await createChannel({
        channel: {
          id: channelId,
          detail,
          options: {
            type,
            mode,
            anonymous,
            ghosting: {mode: ghosting},
            spam,
            notification,
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
        title={localization.title}
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
            {...localization.name}
            errors={errors.name}
          />
          <ControllerDetail
            control={control}
            name="detail"
            {...localization.detail}
            errors={errors.detail}
          />
          <ControllerOption
            control={control}
            name="type"
            {...localization.type}
            errors={errors.type}
            style={styles.textInput}
          />
          <ControllerOption
            control={control}
            name="mode"
            {...localization.mode}
            errors={errors.mode}
            style={styles.textInput}
          />
          <ControllerOption
            control={control}
            name="anonymous"
            {...localization.anonymous}
            errors={errors.anonymous}
            style={styles.textInput}
          />
          <ControllerOption
            control={control}
            name="ghosting"
            {...localization.ghosting}
            errors={errors.ghosting}
            style={styles.textInput}
          />
          <ControllerOption
            control={control}
            name="spam"
            {...localization.spam}
            errors={errors.spam}
            style={styles.textInput}
          />
          <ControllerOption
            control={control}
            name="notificationHours"
            {...localization.notificationHours}
            errors={errors.notificationHours}
            style={styles.textInput}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateGeneralChannelModal;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
