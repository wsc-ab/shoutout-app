import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

import {addComment} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import SubmitIcon from '../buttons/SubmitIconButton';
import DefaultAlert from '../defaults/DefaultAlert';

type TProps = {
  moment: {
    id: string;
  };
  style?: TStyleView;
};

const CommentButton = ({moment, style}: TProps) => {
  const [value, setValue] = useState<string>();

  const onAdd = async () => {
    if (!value) {
      return;
    }
    try {
      await addComment({moment, comment: {detail: value}});
      setValue(undefined);
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to add comment.'});
    }
  };
  return (
    <View style={[{flexDirection: 'row'}, style]}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Comment"
        style={[
          {
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            textAlignVertical: 'center',
          },
        ]}
      />
      <SubmitIcon
        icon="plus"
        color={value ? 'white' : 'gray'}
        onPress={onAdd}
        style={{
          height: 40,
          width: 50,
          padding: 10,
          marginHorizontal: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </View>
  );
};

export default CommentButton;
