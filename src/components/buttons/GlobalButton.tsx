import React from 'react';
import {View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  onPress: () => void;
  style?: TStyleView;
};

const GlobalButton = ({style, onPress}: TProps) => {
  return (
    <View style={style}>
      <DefaultIcon icon="globe" size={25} onPress={onPress} />
    </View>
  );
};

export default GlobalButton;
