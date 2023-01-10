import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {TStyleView} from '../types/style';

type TProps = {
  icon: IconProp;
  onPress: (icon: IconProp) => void;
  style?: TStyleView;
};

const DefaultIcon = ({icon, style, onPress}: TProps) => {
  return (
    <Pressable
      onPress={() => onPress(icon)}
      disabled={!onPress}
      style={[styles.container, style]}>
      <FontAwesomeIcon icon={icon} color="white" />
    </Pressable>
  );
};

export default DefaultIcon;

const styles = StyleSheet.create({
  container: {padding: 10},
});
