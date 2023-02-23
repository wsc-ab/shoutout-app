import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {Pressable} from 'react-native';
import {TStyleView} from '../../types/Style';

type TProps = {
  icon?: IconProp;
  onPress?: (icon?: IconProp) => void;
  style?: TStyleView;
  color?: string;
  size?: number;
};

const DefaultIcon = ({
  icon,
  style,
  color = 'white',
  size = 16,
  onPress,
}: TProps) => {
  if (!icon) {
    return null;
  }
  return (
    <Pressable
      onPress={onPress ? () => onPress(icon) : undefined}
      disabled={!onPress}
      style={style}>
      <FontAwesomeIcon icon={icon} color={color} size={size} />
    </Pressable>
  );
};

export default DefaultIcon;
