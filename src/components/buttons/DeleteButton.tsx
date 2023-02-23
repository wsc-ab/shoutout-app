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

  const onDelete = async () => {
    try {
      setSubmitting(true);
      await removeContent({moment, content});
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error, 'r');

      DefaultAlert({title: 'Failed to delete'});
    } finally {
      setSubmitting(false);
    }
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
