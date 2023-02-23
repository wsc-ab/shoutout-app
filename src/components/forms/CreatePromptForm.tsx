import {yupResolver} from '@hookform/resolvers/yup';
import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
import {createPrompt} from '../../functions/Prompt';
import {getLatLng} from '../../utils/Location';

import {defaultSchema} from '../../utils/Schema';
import {uploadVideo} from '../../utils/Video';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';

type TProps = {
  remotePath: string;
  localPath: string;
};

const CreatePromptForm = ({remotePath, localPath}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {addUpload, removeUpload} = useContext(UploadingContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async ({name}: {name: string}) => {
    try {
      setSubmitting(true);

      const promptId = firebase.firestore().collection('prompts').doc().id;
      const momentId = firebase.firestore().collection('momentId').doc().id;
      const latlng = await getLatLng();
      onUpdate(undefined);

      addUpload({localPath, remotePath, type: 'createPrompt'});
      await uploadVideo({localPath, remotePath});

      await createPrompt({
        moment: {
          id: momentId,
          type: 'everyone',
        },
        prompt: {id: promptId, type: 'friends'},
        content: {path: remotePath, latlng, name},
      });
      removeUpload({localPath, remotePath, type: 'createPrompt'});
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
          <ControllerText
            control={control}
            name="name"
            title="Name"
            detail="Set the name of the moment."
            errors={errors.name}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreatePromptForm;
