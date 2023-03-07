import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';

type TProps = {
  moment: {
    id: string;
    content: {path: string};
    name: string;
    createdBy: {id: string};
  };

  style?: TStyleView;
};

const Footer = ({moment, style}: TProps) => {
  return (
    <View style={[styles.container, style]}>
      <LikeButton moment={moment} style={styles.button} />
      <ShareButton
        input={{
          title: `Hey! Check this ${moment.name} moment out!`,
          target: {
            collection: 'moments',
            id: moment.id,
          },
          image: {path: moment.content.path, type: 'video'},
        }}
        style={styles.button}
      />

      <ReportButton moment={moment} style={styles.button} />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: 'space-between',
  },
  button: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
  },
});
