import React from 'react';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  onPress: () => void;
  style?: TStyleView;
};

const GlobalButton = ({style, onPress}: TProps) => {
  return <DefaultIcon icon="globe" style={style} size={20} onPress={onPress} />;
};

export default GlobalButton;
