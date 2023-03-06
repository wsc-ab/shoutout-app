import React from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import {placeholderTextColor} from './DefaultColors';

import DefaultText from './DefaultText';

type TProps = TextInputProps & {title?: string; detail?: string};

const DefaultLongTextInput = (props: TProps) => {
  return (
    <View style={props.style}>
      <DefaultText title={props.title} textStyle={styles.titleText} />
      <DefaultText title={props.detail} style={styles.detail} />
      <TextInput
        {...props}
        multiline={true}
        placeholderTextColor={placeholderTextColor}
        style={styles.textInput}
        keyboardAppearance="dark"
      />
    </View>
  );
};

export default DefaultLongTextInput;

const styles = StyleSheet.create({
  textInput: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
    marginTop: 10,
    paddingTop: 10,
    height: 200,
  },
  titleText: {fontWeight: 'bold', fontSize: 20},
  detail: {marginTop: 5},
});
