import {yupResolver} from '@hookform/resolvers/yup';
import {firebase} from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {createRoom} from '../../functions/Room';
import {getSameIds} from '../../utils/Array';

import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';
import SelectForm from './SelectForm';

type TProps = {};

const CreateRoomForm = ({}: TProps) => {
  const {text} = defaultSchema();
  const [type, setType] = useState<'users' | 'form'>('users');
  const [userIds, setUserIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const {onUpdate} = useContext(ModalContext);

  const {authUserData} = useContext(AuthUserContext);
  const friends = getSameIds(
    authUserData.followFrom.items,
    authUserData.followTo.items,
  );

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

      const roomId = firebase.firestore().collection('rooms').doc().id;

      await createRoom({
        room: {
          id: roomId,
          type: 'closed',
          name,
        },
        users: {ids: userIds},
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

  const onUsers = (ids: string[]) => {
    setUserIds(ids);
    setType('form');
  };

  return (
    <DefaultModal>
      {type === 'users' && (
        <SelectForm
          onSuccess={onUsers}
          min={1}
          onCancel={() => onUpdate(undefined)}
          data={friends.map(({id, displayName}) => ({
            id,
            name: displayName,
            collection: 'users',
          }))}
          title={'Select friends'}
        />
      )}
      {type === 'form' && (
        <DefaultForm
          title={'Room'}
          left={{
            onPress: () => setType('users'),
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
              detail="A short description of your room."
              errors={errors.name}
            />
          </DefaultKeyboardAwareScrollView>
        </DefaultForm>
      )}
    </DefaultModal>
  );
};

export default CreateRoomForm;
