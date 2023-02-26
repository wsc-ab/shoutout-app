import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
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
};

const AddMomentForm = ({remotePath, localPath, id}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {onUpload} = useContext(UploadingContext);
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
    const target = {
      collection: 'moments',
      id,
      data: {
        remotePath,
        localPath,
        name,
      },
    };

    try {
      setSubmitting(true);

      const latlng = await getLatLng();
      onUpdate(undefined);
      // upload video

      onUpload({
        target,
        status: 'uploading',
      });

      await uploadVideo({localPath, remotePath});

      await addMoment({
        moment: {id},
        content: {path: remotePath, name, latlng},
      });
      onUpload({
        target,
        status: 'ready',
      });

      const onPress = () => {
        onUpdate({
          target: 'user',
          data: {
            id: authUserData.id,
          },
        });
      };

      DefaultAlert({
        title: 'Moment shared!',
        message: 'Press Go to view your moment',
        buttons: [{text: 'Go', onPress: onPress}, {text: 'Cancel'}],
      });
    } catch (error) {
      if ((error as {message: string}).message !== 'cancel') {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      onUpload({
        target,
        status: 'error',
      });
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
            detail="A short description of your moment."
            errors={errors.name}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default AddMomentForm;
