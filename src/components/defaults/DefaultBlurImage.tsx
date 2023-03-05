import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';

import {getThumbnailPath} from '../../utils/Storage';
import CreateMomentButton from '../buttons/CreateMomentButton';
import {defaultBlack} from './DefaultColors';
import DefaultImage from './DefaultImage';
import DefaultText from './DefaultText';

type TProps = {
  path: string;
  imageStyle: {width: number; height: number};
  channel: {id: string};
  style?: TStyleView;
};

const DefaultBlurImage = ({style, path, imageStyle, channel}: TProps) => {
  return (
    <View style={style}>
      <DefaultImage
        imageStyle={imageStyle}
        image={getThumbnailPath(path, 'video')}
        blurRadius={50}
      />
      <View style={styles.blur}>
        <DefaultText title="No more ghosting!" textStyle={styles.text} />
        <DefaultText
          title="Share your moment to view"
          style={styles.text}
          textStyle={styles.textText}
        />
        <DefaultText
          title="what your friends are up to!"
          style={styles.text}
          textStyle={styles.textText}
        />
        <CreateMomentButton channel={channel} style={styles.createButton} />
      </View>
    </View>
  );
};

export default DefaultBlurImage;

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textText: {fontWeight: 'bold'},
  text: {
    marginTop: 10,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: defaultBlack.lv3(1),
    padding: 10,
    borderRadius: 50,
  },
});
