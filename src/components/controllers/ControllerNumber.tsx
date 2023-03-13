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
import {defaultRed, placeholderTextColor} from '../defaults/DefaultColors';

import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

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

const ControllerNumber = ({
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
            value={value >= 0 ? `${value}` : undefined}
            placeholder={placeholder}
            keyboardType="number-pad"
            placeholderTextColor={placeholderTextColor}
            onChangeText={text => onChange(parseInt(text, 10))}
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

export default ControllerNumber;

const styles = StyleSheet.create({
  error: {marginTop: 5},
});
