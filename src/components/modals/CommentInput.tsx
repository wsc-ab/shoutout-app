import React, {useState} from 'react';
import {KeyboardAvoidingView, TextInput, View} from 'react-native';

import {addComment} from '../../functions/Moment';
import SubmitIcon from '../buttons/SubmitIconButton';
import DefaultBottomModal from '../defaults/DefaultBottomModal';

type TProps = {
  moment: {
    id: string;
  };
};

const CommentInput = ({moment}: TProps) => {
  const [value, setValue] = useState<string>();

  // const renderItem = ({item}) => {
  //   return (
  //     <View style={{flexDirection: 'row'}} key={item.addedAt}>
  //       <UserProfileImage
  //         user={{
  //           id: item.user.id,
  //         }}
  //       />
  //       <View style={{marginLeft: 10, flex: 1}}>
  //         <View>
  //           <DefaultText
  //             title={item.user.displayName}
  //             textStyle={{fontWeight: 'bold', fontSize: 16}}
  //             style={{marginBottom: 5, flex: 1}}
  //           />
  //         </View>
  //         <DefaultText title={item.detail} textStyle={{}} />
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             flex: 1,
  //             alignItems: 'center',
  //           }}>
  //           <DefaultText
  //             title={`${getTimeGap(item.addedAt)} ago`}
  //             textStyle={{fontSize: 14, color: 'lightgray'}}
  //             style={{flex: 1}}
  //           />
  //           <SubmitIcon
  //             onPress={async () => await onRemove(item)}
  //             icon={'times'}
  //           />
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  const onAdd = async () => {
    if (!value) {
      return;
    }
    try {
      await addComment({moment, comment: {detail: value}});
    } catch (error) {
    } finally {
    }
  };
  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          padding: 10,
          alignItems: 'flex-end',
        }}>
        <TextInput
          value={value}
          // multiline
          onChangeText={setValue}
          placeholder="Comment"
          autoCorrect={false}
          style={[
            {
              flex: 1,
              alignItems: 'center',
              padding: 10,
              marginBottom: 24,
              height: 50,
              textAlignVertical: 'center',
            },
          ]}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentInput;
