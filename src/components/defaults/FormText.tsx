import React from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';
import {StyleSheet, TextInputProps, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import {defaultRed, placeholderTextColor} from './DefaultColors';

import DefaultText from './DefaultText';
import DefaultTextInput from './DefaultTextInput';

type TProps = TextInputProps & {
  name: string;
  title?: string;
  detail?: string;
  control: Control<any, any>;
  errors?: Merge<
    FieldError,
    (FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined)[]
  >;
  optional?: boolean;
  style?: TStyleView;
  placeholder?: string;
};

const FormText = ({
  title,
  detail,
  name,
  placeholder,
  control,
  errors,
  style,
  optional,
  ...props
}: TProps) => {
  return (
    <View style={style}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <DefaultTextInput
            {...props}
            title={optional ? title : title ? `${title}*` : undefined}
            detail={detail}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
        name={name}
      />
      {errors && (
        <DefaultText
          title={errors.message}
          textStyle={{color: defaultRed.lv2}}
          style={styles.error}
        />
      )}
    </View>
  );
};

export default FormText;

const styles = StyleSheet.create({
  textInput: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
    marginTop: 5,
  },
  titleText: {fontWeight: 'bold', fontSize: 20},
  detail: {marginTop: 5},
  error: {marginTop: 5},
});
