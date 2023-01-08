import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {placeholderTextColor} from './styles/DefaultColors';

type TProps = TextInputProps;

const DefaultTextInput = (props: TProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor}
      style={styles.textInput}
    />
  );
};

export default DefaultTextInput;

const styles = StyleSheet.create({
  textInput: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
  },
});
