import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {onSuccess: () => void; style?: TStyleView};

const NextButton = ({onSuccess, style}: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onPass = async () => {
    setIsLoading(true);

    onSuccess();
    setIsLoading(false);
  };

  return (
    <View style={style}>
      {!isLoading && <DefaultIcon icon="arrow-down" onPress={onPass} />}
      {isLoading && <ActivityIndicator style={styles.act} />}
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  act: {paddingHorizontal: 10},
});
