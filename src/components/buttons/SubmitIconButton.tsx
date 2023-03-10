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

const SubmitIconButton = ({onPress, icon, style, color}: TProps) => {
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
    <View style={[styles.container, style]}>
      {!submitting && (
        <DefaultIcon icon={icon} size={20} color={color} onPress={onDelete} />
      )}
      {submitting && <ActivityIndicator />}
    </View>
  );
};

export default SubmitIconButton;

const styles = StyleSheet.create({container: {padding: 10}});
