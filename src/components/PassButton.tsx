import React from 'react';
import {View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {addPass} from '../functions/content';

type TProps = {id: string; onSuccess: () => void};

const PassButton = ({id, onSuccess}: TProps) => {
  const onPass = async () => {
    onSuccess();
    await addPass({content: {id}});
  };

  return (
    <View>
      <DefaultText title="Pass" onPress={onPass} />
    </View>
  );
};

export default PassButton;
