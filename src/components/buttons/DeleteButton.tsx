import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {deleteMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  moment: {id: string};

  style?: TStyleView;
  onSuccess?: () => void;
};

const DeleteButton = ({moment, style, onSuccess}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onDelete = () => {
    const onPress = async () => {
      try {
        setSubmitting(true);
        await deleteMoment({moment});
        onSuccess && onSuccess();
      } catch (error) {
        DefaultAlert({title: 'Failed to delete'});
      } finally {
        setSubmitting(false);
      }
    };

    DefaultAlert({
      title: 'Please confirm',
      message: 'Delete this content?',
      buttons: [{text: 'No'}, {text: 'Delete', style: 'destructive', onPress}],
    });
  };

  return (
    <View style={style}>
      {!submitting && (
        <DefaultIcon icon={'times'} style={style} onPress={onDelete} />
      )}
      {submitting && <ActivityIndicator />}
    </View>
  );
};

export default DeleteButton;
