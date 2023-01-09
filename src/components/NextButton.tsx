import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {addView} from '../functions/Content';

type TProps = {id: string; onSuccess: () => void};

const PassButton = ({id, onSuccess}: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onPass = async () => {
    setIsLoading(true);
    await addView({content: {id}});
    onSuccess();
    setIsLoading(false);
  };

  return (
    <View>
      {!isLoading && <DefaultText title="Next" onPress={onPass} />}
      {isLoading && <ActivityIndicator />}
    </View>
  );
};

export default PassButton;
