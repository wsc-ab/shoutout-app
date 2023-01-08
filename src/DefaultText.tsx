import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TStyleText, TStyleView} from './types/style';

export type TTextType =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2';

type Props = {
  title?: string;
  style?: TStyleView;
  textStyle?: TStyleText;
  onPress?: () => void;
};

const DefaultText = ({title, style, textStyle, onPress}: Props) => {
  if (!title) {
    return null;
  }

  return (
    <Pressable style={style} onPress={onPress} disabled={!onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default DefaultText;

const styles = StyleSheet.create({text: {color: 'white'}});
