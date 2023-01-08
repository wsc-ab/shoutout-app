import React from 'react';
import {View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {addPass} from '../functions/Content';

type TProps = {id: string; onSuccess: () => void};

const PassButton = ({id, onSuccess}: TProps) => {
  const onPass = async () => {
    await addPass({content: {id}});
    onSuccess();
  };

  return (
    <View>
      <DefaultText title="Pass" onPress={onPass} />
    </View>
  );
};

export default PassButton;
