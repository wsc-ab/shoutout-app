import React from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultImage from './DefaultImage';
import DefaultVideo from './DefaultVideo';
import {TDocData} from './types/firebase';
import {TStyleView} from './types/style';

type TProps = {
  content: TDocData;
  style?: TStyleView;
};

const ContentCard = ({content: {path, type}, style}: TProps) => {
  return (
    <>
      <View style={[styles.container, style]}>
        {type?.includes('image') && (
          <DefaultImage image={path} style={{width: 300, height: 300}} />
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
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
  },
});
