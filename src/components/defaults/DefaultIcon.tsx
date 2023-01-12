import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {TStyleView} from '../../types/Style';

type TProps = {
  icon: IconProp;
  onPress?: (icon?: IconProp) => void;
  style?: TStyleView;
  color?: string;
};

const DefaultIcon = ({icon, style, color = 'white', onPress}: TProps) => {
  return (
    <Pressable
      onPress={onPress ? () => onPress(icon) : undefined}
      disabled={!onPress}
      style={[styles.container, style]}>
      <FontAwesomeIcon icon={icon} color={color} />
    </Pressable>
  );
};

export default DefaultIcon;

const styles = StyleSheet.create({
  container: {padding: 10},
});
