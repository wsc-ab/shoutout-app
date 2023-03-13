import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {object} from 'yup';
import LanguageContext from '../../contexts/Language';
import ModalContext from '../../contexts/Modal';
import {deleteChannel, editChannel} from '../../functions/Channel';
import {TDocData} from '../../types/Firebase';
import {getLocalHour} from '../../utils/Date';
import {defaultSchema} from '../../utils/Schema';
import ControllerOption from '../controllers/ControllerOption';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import {localizations} from './EditChannelModal.localizations';

type TProps = {onCancel: () => void; channel: TDocData; onSuccess: () => void};

const EditChannelModal = ({onCancel, channel, onSuccess}: TProps) => {
  const [submitting, setSubmitting] = useState(false);
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];

  const {text, number} = defaultSchema();

  const onDelete = () => {
    const onPress = async () => {
      try {
        setSubmitting(true);
        await deleteChannel({channel: {id: channel.id}});
        DefaultAlert(localization.deleteSuccess);
      } catch (error) {
        DefaultAlert(localization.deleteError);
      } finally {
        setSubmitting(false);
      }
    };

    DefaultAlert({
      title: localization.deleteConfirm.title,
      message: localization.deleteConfirm.message,
      buttons: [
        {text: localization.deleteConfirm.no},
        {
          text: localization.deleteConfirm.delete,
          onPress,
          style: 'destructive',
        },
      ],
    });
  };

  const {onUpdate} = useContext(ModalContext);

  const schema = object({
    name: text({min: 1, max: 50, required: true}),
    mode: text({required: true}),
    ghosting: text({required: true}),
    spam: text({required: true}),
    notificationHours: number({min: 0, max: 23}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: channel.name as string,
      mode: channel.options.mode as string,
      ghosting: channel.options.ghosting.mode as string,
      spam: channel.options.spam as string,
      notificationHours: channel.options.notification?.hours
        ? getLocalHour(channel.options.notification.hours as number).toString()
        : 'off',
    },
  });

  const onSubmit = async ({
    name,
    mode,
    ghosting,
    spam,
    notificationHours,
  }: {
    name: string;
    mode: 'camera' | 'library' | 'both';
    ghosting: 'off' | '1' | '7' | '14';
    spam: 'off' | '1' | '3' | '6' | '12' | '24';
    notificationHours: string | undefined;
  }) => {
    try {
      setSubmitting(true);

      let notification;

      if (typeof notificationHours === 'number') {
        const now = new Date();
        now.setHours(parseInt(notificationHours, 10));
        now.getUTCHours();
        notification = {
          hours: [now.getUTCHours()],
          days: [0, 1, 2, 3, 4, 5, 6],
        };
      }

      await editChannel({
        channel: {
          id: channel.id,
          options: {
            type: channel.options.type,
            mode,
            ghosting: {mode: ghosting},
            spam,
            notification,
          },
          name,
        },
      });
      onSuccess();
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
        left={{onPress: onCancel}}
        right={{submitting, onPress: handleSubmit(onSubmit)}}
        title={localization.title}>
        <DefaultKeyboardAwareScrollView>
          <ControllerText
            control={control}
            name="name"
            {...localization.name}
            errors={errors.name}
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
          <View style={styles.textInput}>
            <DefaultText
              title={localization.delete}
              onPress={onDelete}
              textStyle={{color: defaultRed.lv1, fontSize: 20}}
            />
            <DefaultText
              title={localization.deleteDetail}
              style={{marginTop: 5}}
            />
          </View>
        </DefaultKeyboardAwareScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default EditChannelModal;

const styles = StyleSheet.create({textInput: {marginTop: 20}});
