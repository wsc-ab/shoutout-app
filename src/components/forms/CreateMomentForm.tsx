import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
import {createMoment} from '../../functions/Moment';
import {getLatLng} from '../../utils/Location';

import {defaultSchema} from '../../utils/Schema';
import {uploadVideo} from '../../utils/Video';
import ControllerOption from '../controllers/ControllerOption';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';

type TProps = {
  remotePath: string;
  localPath: string;
  id: string;
  room?: {id: string};
};

const CreateMomentForm = ({remotePath, localPath, id, room}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {addUpload, removeUpload} = useContext(UploadingContext);

  const schema = object({
    name: text({max: 50, required: true}),
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

      const latlng = await getLatLng();
      onUpdate(undefined);
      // upload video
      addUpload({localPath, remotePath, type: 'addMoment'});

      await uploadVideo({localPath, remotePath});

      await createMoment({
        moment: {
          id,
          path: remotePath,
          latlng,
          name,
          type,
        },
        room,
      });

      removeUpload({localPath, remotePath, type: 'addMoment'});
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
          <ControllerOption
            control={control}
            name="type"
            title="Type"
            detail="Select friends to share only with friends."
            errors={errors.type}
            style={styles.textInput}
            options={[
              {name: 'everyone', title: 'Everyone'},
              {name: 'friends', title: 'Friends'},
            ]}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default CreateMomentForm;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
