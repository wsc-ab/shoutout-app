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
  const {text} = defaultSchema();

  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    type: text({required: true}),
    mode: text({required: true}),
    ghosting: text({required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'public',
      name: '',
      mode: 'both',
      ghosting: '7',
    },
  });

  const onSubmit = async ({
    name,
    type,
    mode,
    ghosting,
  }: {
    name: string;
    type: 'public' | 'private';
    mode: 'camera' | 'library' | 'both';
    ghosting: 'off' | '1' | '7' | '14';
  }) => {
    try {
      setSubmitting(true);

      const channelId = firebase.firestore().collection('channels').doc().id;

      await createChannel({
        channel: {
          id: channelId,
          options: {
            type,
            mode,
            ghosting: {mode: ghosting},
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
            name="ghosting"
            {...localization.ghosting}
            errors={errors.ghosting}
            style={styles.textInput}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateGeneralChannelModal;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
