import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {removeMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  moment: {id: string};
  content: {path: string};
  style?: TStyleView;
  onSuccess?: () => void;
};

const DeleteButton = ({moment, content, style, onSuccess}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onDelete = () => {
    const onPress = async () => {
      try {
        setSubmitting(true);
        await removeMoment({moment, content});
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
