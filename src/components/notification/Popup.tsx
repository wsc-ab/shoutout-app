import React, {useContext} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ModalContext from '../../contexts/Modal';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  notification: {
    title: string;
    body: string;
    collection?: 'moments' | 'users';
    id?: string;
  };
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
};

const Popup = ({
  notification: {title, body, collection, id},
  onCancel,
  style,
}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      style={style}
      onPress={() => {
        if (collection) {
          onUpdate({target: collection, id});
        }

        onCancel();
      }}>
      <View style={styles.texts}>
        <DefaultText
          title={title}
          style={styles.text}
          textStyle={styles.textStyle}
        />
        <DefaultText title={body} style={styles.text} />
      </View>
      {onCancel && <DefaultIcon icon={'times'} onPress={onCancel} />}
    </Pressable>
  );
};

export default Popup;

const styles = StyleSheet.create({
  texts: {flex: 1, marginRight: 10},
  textStyle: {fontWeight: 'bold'},
  text: {alignSelf: 'flex-start'},
});
