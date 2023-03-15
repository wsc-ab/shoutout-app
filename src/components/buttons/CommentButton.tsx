import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {addComment} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import SubmitIcon from '../buttons/SubmitIconButton';
import DefaultAlert from '../defaults/DefaultAlert';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
};

const CommentButton = ({moment, style}: TProps) => {
  const [value, setValue] = useState<string>();

  const onAdd = async () => {
    if (!value) {
      return;
    }
    try {
      setValue(undefined);
      await addComment({moment: {id: moment.id}, comment: {detail: value}});
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to add comment.'});
    }
  };
  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Comment"
        enablesReturnKeyAutomatically
        onSubmitEditing={onAdd}
        style={styles.input}
      />
      <SubmitIcon
        icon="plus"
        color={value ? 'white' : 'gray'}
        onPress={onAdd}
        style={styles.icon}
      />
    </View>
  );
};

export default CommentButton;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  input: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    textAlignVertical: 'center',
  },
  icon: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
