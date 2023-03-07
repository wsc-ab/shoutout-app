import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {TStyleText, TStyleView} from '../../types/Style';

type Props<A extends string> = {
  title?: A;
  style?: TStyleView;
  textStyle?: TStyleText;
  onPress?: (text: A) => void;
  numberOfLines?: number;
};

const DefaultText = <A extends string>({
  title,
  style,
  textStyle,
  onPress,
  numberOfLines,
}: Props<A>) => {
  if (title === undefined) {
    return null;
  }

  return (
    <Pressable
      style={style}
      onPress={onPress ? () => onPress(title) : undefined}
      disabled={!onPress}>
      <Text style={[styles.text, textStyle]} numberOfLines={numberOfLines}>
        {title}
      </Text>
    </Pressable>
  );
};

export default DefaultText;

const styles = StyleSheet.create({
  text: {color: 'white'},
});
