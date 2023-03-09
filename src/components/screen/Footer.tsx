import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import CommentButton from '../buttons/CommentButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';

type TProps = {
  moment: {
    id: string;
    content: {path: string};
    name: string;
    createdBy: {id: string};
    comments?: [];
  };

  style?: TStyleView;
};

const Footer = ({moment, style}: TProps) => {
  return (
    <View style={[styles.container, style]}>
      <LikeButton moment={moment} style={styles.button} />
      <CommentButton moment={moment} style={styles.button} />
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
