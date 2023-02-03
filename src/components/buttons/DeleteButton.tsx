import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {removeMoment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  item: {id: string; path: string};
  style?: TStyleView;
  onSuccess?: () => void;
};

const DeleteButton = ({item, style, onSuccess}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onDelete = async (moment: {id: string; path: string}) => {
    try {
      setSubmitting(true);
      await removeMoment({moment});
      onSuccess && onSuccess();
    } catch (error) {
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
          style={style}
          onPress={async () =>
            await onDelete({
              id: item.id,
              path: item.path,
            })
          }
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
