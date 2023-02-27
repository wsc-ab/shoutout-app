import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import AuthUserContext from '../../contexts/AuthUser';
import PopupContext from '../../contexts/Popup';

import {addMoment} from '../../functions/Moment';
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
  id: string;
  onCancel: () => void;
  onSuccess: () => void;
};

const AddMomentForm = ({
  remotePath,
  localPath,
  id,
  onSuccess,
  onCancel,
}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {addUpload, addPopup, removeUpload} = useContext(PopupContext);
  const {authUserData} = useContext(AuthUserContext);

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

      const latlng = await getLatLng();
      onSuccess();
      addUpload({id, localPath});

      await uploadVideo({localPath, remotePath});

      await addMoment({
        moment: {id},
        content: {path: remotePath, name, latlng},
      });
      removeUpload({id});
      addPopup({
        id,
        title: 'Moment uploaded',
        body: 'Press to check your profile',
        target: 'user',
        data: {id: authUserData.id},
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
    }
  };

  return (
    <DefaultModal>
      <DefaultForm
        title={'Moment'}
        left={{onPress: onCancel}}
        right={{
          onPress: handleSubmit(onSubmit),
          submitting,
        }}>
        <DefaultKeyboardAwareScrollView>
          <ControllerText
            control={control}
            name="name"
            title="Name"
            detail="A short description of your moment."
            errors={errors.name}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default AddMomentForm;
