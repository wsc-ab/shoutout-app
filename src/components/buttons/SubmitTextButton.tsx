import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TStyleText, TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  onPress: () => Promise<void>;
  color?: string;
  title: string;
  textStyle: TStyleText;
  style?: TStyleView;
};

const SubmitTextButton = ({onPress, title, style, textStyle}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await onPress();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <View style={style}>
      {!submitting && (
        <DefaultText title={title} onPress={onSubmit} textStyle={textStyle} />
      )}
      {submitting && <ActivityIndicator />}
    </View>
  );
};

export default SubmitTextButton;
