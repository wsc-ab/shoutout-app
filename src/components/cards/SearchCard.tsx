import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {THitItem} from '../../types/Algolia';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  item: THitItem;
};

const SearchCard = ({item}: TProps) => {
  return (
    <View>
      <DefaultText title={item.displayName} />
    </View>
  );
};

export default SearchCard;

const styles = StyleSheet.create({});
