import React from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultImage from '../defaults/DefaultImage';
import DefaultVideo from '../defaults/DefaultVideo';
import {TDocData} from '../types/firebase';
import {TStyleView} from '../types/style';

type TProps = {
  content: TDocData;
  style?: TStyleView;
};

const ContentCard = ({content: {path, type}, style}: TProps) => {
  return (
    <>
      <View style={[styles.container, style]}>
        {type?.includes('image') && (
          <DefaultImage image={path} style={styles.image} />
        )}
        {type?.includes('video') && <DefaultVideo path={path} />}
      </View>
    </>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {width: 300, height: 300},
});
