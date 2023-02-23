import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import AddContentButton from '../buttons/AddContentButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';
import {defaultBlack} from '../defaults/DefaultColors';

type TProps = {
  item: {
    id: string;
    path: string;
    user: {id: string};
    likeFrom: {number: number};
  };
  number?: number;
  style?: TStyleView;
};

const Footer = ({item, number, style}: TProps) => {
  return (
    <View style={[styles.container, style]}>
      <LikeButton
        moment={{
          id: item.id,
          path: item.path,
          user: {id: item.user.id},
          likeFrom: item.likeFrom,
        }}
        style={styles.button}
      />

      <AddContentButton
        id={item.id}
        number={number ?? 0}
        style={styles.button}
      />

      <ShareButton
        input={{
          title:
            'Hey! Check this moment out! You can also connect yours to it!',
          param: 'moments',
          value: item.id,
          image: {path: item.path, type: 'video'},
        }}
        style={styles.button}
      />

      <ReportButton
        moment={{
          id: item.id,
          path: item.path,
          user: {id: item.user.id},
        }}
        style={styles.button}
      />
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
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: defaultBlack.lv3(1),
    borderRadius: 20,
  },
});
