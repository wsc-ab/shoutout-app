import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {addView} from '../functions/Content';
import {TStyleView} from '../types/style';

type TProps = {id: string; onSuccess: () => void; style?: TStyleView};

const PassButton = ({id, onSuccess, style}: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onPass = async () => {
    setIsLoading(true);
    await addView({content: {id}});
    onSuccess();
    setIsLoading(false);
  };

  return (
    <View style={style}>
      {!isLoading && <DefaultText title="Next" onPress={onPass} />}
      {isLoading && <ActivityIndicator />}
    </View>
  );
};

export default PassButton;
