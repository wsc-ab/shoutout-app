import {yupResolver} from '@hookform/resolvers/yup';
import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
import {addMoment} from '../../functions/Moment';
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
};

const AddMomentForm = ({remotePath, localPath, id}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);
  const {addUpload, removeUpload} = useContext(UploadingContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    type: text({required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      type: 'everyone',
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
      const momentId = firebase.firestore().collection('momentId').doc().id;
      const latlng = await getLatLng();

      // upload video
      addUpload({localPath, remotePath, type: 'addMoment'});

      await uploadVideo({localPath, remotePath});

      await addMoment({
        prompt: {id},
        moment: {id: momentId, type},
        content: {path: remotePath, name, latlng},
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
            detail="A short description of your moment."
            errors={errors.name}
          />
          <ControllerOption
            control={control}
            name="type"
            title="Type"
            detail="Select friends to share only with friends."
            errors={errors.type}
            options={[
              {name: 'everyone', title: 'Everyone'},
              {name: 'friends', title: 'Friends'},
            ]}
            style={styles.textInput}
          />
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default AddMomentForm;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
