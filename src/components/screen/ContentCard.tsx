import React from 'react';
import {StyleSheet, View} from 'react-native';

import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultImage from '../defaults/DefaultImage';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  content: TDocData;
  style?: TStyleView;
  contentStyle?: {height: number; width: number};
};

const ContentCard = ({
  content: {path, type},
  style,
  contentStyle = {height: 300, width: 300},
}: TProps) => {
  return (
    <>
      <View style={[styles.container, style]}>
        {type?.includes('image') && (
          <DefaultImage image={path} style={[styles.content, contentStyle]} />
        )}
        {type?.includes('video') && (
          <DefaultVideo path={path} style={[styles.content, contentStyle]} />
        )}
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
  content: {borderRadius: 10},
});
