import React from 'react';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  onPress: () => void;
  style?: TStyleView;
};

const FriendsButton = ({style, onPress}: TProps) => {
  return (
    <DefaultIcon icon="folder" style={style} size={20} onPress={onPress} />
  );
};

export default FriendsButton;
