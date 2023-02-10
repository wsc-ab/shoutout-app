import {
  getHighlightedParts,
  getPropertyByPath,
} from 'instantsearch.js/es/lib/utils';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {THitItem} from '../../types/Algolia';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  hit: THitItem;
  attribute: string | string[];
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  renderTitle?: (value: string) => string;
};

const Highlight = ({hit, attribute, style, textStyle, renderTitle}: TProps) => {
  const {value: attributeValue = ''} =
    getPropertyByPath(hit._highlightResult, attribute) || {};
  const parts = getHighlightedParts(attributeValue);

  return (
    <View style={[styles.highlight, style]}>
      {parts.map((part, index) => {
        return (
          <DefaultText
            key={part.value + index}
            title={renderTitle ? renderTitle(part.value) : part.value}
            textStyle={textStyle}
          />
        );
      })}
    </View>
  );
};

export default Highlight;

const styles = StyleSheet.create({
  highlight: {flexDirection: 'row'},
});
