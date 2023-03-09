import {IconProp} from '@fortawesome/fontawesome-svg-core';
import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  onPress: () => Promise<void>;
  color?: string;
  icon: IconProp;
  style?: TStyleView;
};

const SubmitIcon = ({onPress, icon, style, color}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const onDelete = async () => {
    try {
      setSubmitting(true);
      console.log('onpress');
      await onPress();
      console.log('onpress end');
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <View style={style}>
      {!submitting && (
        <DefaultIcon
          icon={icon}
          style={{padding: 10}}
          color={color}
          onPress={onDelete}
        />
      )}
      {submitting && <ActivityIndicator style={{padding: 10}} />}
    </View>
  );
};

export default SubmitIcon;

const styles = StyleSheet.create({});
