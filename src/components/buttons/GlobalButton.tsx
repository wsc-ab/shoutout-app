import React from 'react';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  onPress: () => void;
  style?: TStyleView;
  color?: string;
};

const GlobalButton = ({style, color, onPress}: TProps) => {
  return (
    <DefaultIcon
      icon="globe"
      style={style}
      size={20}
      onPress={onPress}
      color={color}
    />
  );
};

export default GlobalButton;
