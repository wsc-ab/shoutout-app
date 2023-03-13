import React from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import {defaultRed} from '../defaults/DefaultColors';

import DefaultText from '../defaults/DefaultText';

type TProps = {
  name: string;
  title?: string;
  detail?: string;
  options: {value?: string | number | undefined; title: string}[];
  control: Control<any, any>;
  errors?: Merge<
    FieldError,
    (FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined)[]
  >;
  optional?: boolean;
  style?: TStyleView;
  placeholder?: string;
};

const ControllerOption = ({
  title,
  detail,
  name,
  options,
  control,
  errors,
  style,
  optional,
}: TProps) => {
  return (
    <View style={style}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => {
          return (
            <>
              <DefaultText
                title={optional ? title : title ? `${title}*` : undefined}
                textStyle={styles.titleText}
              />
              <DefaultText title={detail} style={styles.detail} />
              <ScrollView
                horizontal
                style={styles.options}
                indicatorStyle="white">
                {options.map(({title: elTitle, value: elValue}) => (
                  <DefaultText
                    title={elTitle}
                    key={elValue}
                    style={[
                      styles.option,
                      value === elValue && styles.selected,
                    ]}
                    onPress={() => {
                      onBlur();
                      onChange(elValue);
                    }}
                  />
                ))}
              </ScrollView>
            </>
          );
        }}
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

export default ControllerOption;

const styles = StyleSheet.create({
  error: {marginTop: 5},
  titleText: {fontWeight: 'bold', fontSize: 20},
  detail: {marginTop: 5},
  options: {marginTop: 10},
  option: {
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 10,
  },
  selected: {borderColor: 'white'},
});
