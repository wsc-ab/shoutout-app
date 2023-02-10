import React, {ReactElement} from 'react';
import {useHits} from 'react-instantsearch-hooks';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {THitItem} from '../../types/Algolia';

type TProps = {
  style?: StyleProp<ViewStyle>;
  renderItem?: (hit: THitItem) => ReactElement | null;
  updateHits?: (hit: THitItem[]) => void;
};

export const Hits = ({renderItem, style, updateHits}: TProps) => {
  const {hits} = useHits<THitItem>();

  if (updateHits) {
    updateHits(hits);
  }

  if (!renderItem) {
    return null;
  }

  return (
    <View style={[style, styles.hits]}>{hits.map(hit => renderItem(hit))}</View>
  );
};

const styles = StyleSheet.create({
  hits: {flex: 1},
});
