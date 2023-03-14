import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import PopupContext from '../../contexts/Popup';

import {createMoment} from '../../functions/Moment';
import {getLatLng} from '../../utils/Location';

import {defaultSchema} from '../../utils/Schema';
import {uploadImage, uploadVideo} from '../../utils/Upload';

import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';

type TProps = {
  remotePath: string;
  localPath: string;
  id: string;
  content: {mode: 'camera' | 'library'; media: 'image' | 'video'};
  channel: {
    id: string;
  };
};

const CreateMomentForm = ({
  remotePath,
  localPath,
  id,
  content,
  channel,
}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {addUpload, removeUpload} = useContext(PopupContext);
  const {onUpdate} = useContext(ModalContext);

  const schema = object({
    name: text({max: 50, required: true}),
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

      const latlng = await getLatLng();
      onUpdate(undefined);
      addUpload({id, localPath});

      if (content.media === 'video') {
        await uploadVideo({localPath, remotePath});
      } else {
        await uploadImage({localPath, remotePath});
      }

      await createMoment({
        moment: {
          id,
          content: {
            ...content,
            path: remotePath,
          },
          latlng,
          name,
        },
        channel,
      });

      removeUpload({id});
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
    <DefaultModal>
      <DefaultForm
        title={'Moment'}
        left={{onPress: () => onUpdate(undefined)}}
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

export default CreateMomentForm;
