import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {removeContent} from '../../functions/Moment';
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
        await removeContent({moment, content});
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
        <DefaultIcon
          icon={'times'}
          style={[{padding: 10}, style]}
          onPress={async () => await onDelete()}
        />
      )}
      {submitting && <ActivityIndicator style={styles.act} />}
    </View>
  );
};

export default DeleteButton;

const styles = StyleSheet.create({
  act: {paddingHorizontal: 10},
});
