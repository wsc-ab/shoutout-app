import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import AuthUserContext from '../../contexts/AuthUser';
import PopupContext from '../../contexts/Popup';

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
  onCancel: () => void;
  onSuccess: () => void;
};

const CreateMomentForm = ({
  remotePath,
  localPath,
  id,
  room,
  onCancel,
  onSuccess,
}: TProps) => {
  const {text} = defaultSchema();
  const [submitting, setSubmitting] = useState(false);
  const {addUpload, removeUpload, addPopup} = useContext(PopupContext);
  const {authUserData} = useContext(AuthUserContext);

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
    } as {type: 'everyone' | 'friends'; name: string},
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
      onSuccess();
      addUpload({id, localPath});

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
