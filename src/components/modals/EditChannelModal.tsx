import React, {useContext, useState} from 'react';
import LanguageContext from '../../contexts/Language';
import {deleteChannel} from '../../functions/Channel';
import {TDocData} from '../../types/Firebase';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import {localizations} from './EditChannelModal.localization';

type TProps = {onCancel: () => void; channel: TDocData};

const EditChannelModal = ({onCancel, channel}: TProps) => {
  const [submitting, setSubmitting] = useState(false);
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const onDelete = async () => {
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

  return (
    <DefaultModal>
      <DefaultForm
        left={{onPress: onCancel}}
        right={{submitting, onPress: onCancel}}
        title={localization.title}
        style={{marginHorizontal: 20}}>
        <DefaultText title={localization.delete} onPress={onDelete} />
      </DefaultForm>
    </DefaultModal>
  );
};

export default EditChannelModal;
