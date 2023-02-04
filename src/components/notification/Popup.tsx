import React, {useContext, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ModalContext from '../../contexts/Modal';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  notification: {
    title: string;
    body: string;
    collection?: string;
    id?: string;
  };
  onPress?: (collection?: string, id?: string) => void;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
};

const Popup = ({
  notification: {title, body, collection, id},
  onPress,
  onCancel,
  style,
}: TProps) => {
  const {modal, onUpdate} = useContext(ModalContext);
  const [target, setTarget] = useState<{collection?: string; id?: string}>();

  return (
    <Pressable
      style={style}
      disabled={!onPress}
      onPress={
        onPress
          ? () => {
              onUpdate('notification');
              setTarget({collection, id});
              onCancel();
            }
          : undefined
      }>
      <View style={styles.texts}>
        <DefaultText title={title} style={styles.text} />
        <DefaultText title={body} style={styles.text} />
      </View>
      {onCancel && <DefaultIcon icon={'times'} onPress={onCancel} />}
    </Pressable>
  );
};

export default Popup;

const styles = StyleSheet.create({
  texts: {flex: 1, marginRight: 10},
  text: {alignSelf: 'flex-start'},
});