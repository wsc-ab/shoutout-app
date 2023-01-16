import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  links: {name: string; website: string}[];
  style?: TStyleView;
};

const LinkButton = ({links, style}: TProps) => {
  return (
    <View style={[styles.container, style]}>
      <DefaultText title="Link" textStyle={styles.titleText} />
      {links.length === 0 && <DefaultText title="Link is not set." />}
      {links.length >= 1 && links[0].website && (
        <DefaultText
          title={links[0].name || links[0].website}
          style={styles.website}
          onPress={() => Linking.openURL(links[0].website)}
        />
      )}
    </View>
  );
};

export default LinkButton;

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center'},
  titleText: {fontWeight: 'bold'},
  website: {
    marginLeft: 10,
  },
});
