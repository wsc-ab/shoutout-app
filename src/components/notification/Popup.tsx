import React, {useContext} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TNotification} from '../../types/Data';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  notification: TNotification;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
};

const Popup = ({
  notification: {title, body, image, collection, id, icon, color},
  onCancel,
  style,
}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  console.log(image, 'image');

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => {
        if (collection) {
          onUpdate({target: collection, id});
        }

        onCancel();
      }}>
      <DefaultIcon icon={icon} color={color} />
      <DefaultImage
        image={image}
        style={styles.image}
        imageStyle={styles.imageStyle}
      />
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
  container: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  texts: {marginLeft: 20, flex: 1},
  textStyle: {fontWeight: 'bold', fontSize: 16},
  text: {alignSelf: 'flex-start'},
  image: {marginLeft: 10},
  imageStyle: {
    height: 50,
    width: 50,
  },
});
