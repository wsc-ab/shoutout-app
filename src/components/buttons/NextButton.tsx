import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {addView} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {id: string; onSuccess: () => void; style?: TStyleView};

const NextButton = ({id, onSuccess, style}: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onPass = async () => {
    setIsLoading(true);
    await addView({content: {id}});
    onSuccess();
    setIsLoading(false);
  };

  return (
    <View style={style}>
      {!isLoading && (
        <DefaultIcon icon="arrow-down" onPress={onPass} style={styles.icon} />
      )}
      {isLoading && <ActivityIndicator style={styles.act} />}
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  icon: {alignItems: 'flex-start'},
  act: {alignItems: 'flex-start', paddingHorizontal: 10},
});
