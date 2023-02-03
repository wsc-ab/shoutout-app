import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {TStyleText, TStyleView} from '../../types/Style';

type Props<A extends string> = {
  title?: A;
  style?: TStyleView;
  textStyle?: TStyleText;
  onPress?: (text: A) => void;
};

const DefaultText = <A extends string>({
  title,
  style,
  textStyle,
  onPress,
}: Props<A>) => {
  if (!title) {
    return null;
  }

  return (
    <Pressable
      style={style}
      onPress={onPress ? () => onPress(title) : undefined}
      disabled={!onPress}>
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
};

export default DefaultText;

const styles = StyleSheet.create({text: {color: 'white'}});
