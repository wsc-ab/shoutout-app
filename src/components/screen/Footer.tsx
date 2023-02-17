import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import AddButton from '../buttons/AddButton';
import CreateButton from '../buttons/CreateButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';
import {defaultBlack} from '../defaults/DefaultColors';

type TProps = {
  item?: {
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
      {item && (
        <LikeButton
          moment={{
            id: item.id,
            path: item.path,
            user: {id: item.user.id},
            likeFrom: item.likeFrom,
          }}
          style={styles.button}
        />
      )}
      {!!(item && number) && (
        <AddButton id={item.id} number={number} style={styles.button} />
      )}
      {!item && <View style={styles.button} />}
      {!item && <View style={styles.button} />}

      <CreateButton style={styles.button} />
      {item && (
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
      )}
      {item && (
        <ReportButton
          moment={{
            id: item.id,
            path: item.path,
            user: {id: item.user.id},
          }}
          style={styles.button}
        />
      )}
      {!item && <View style={styles.button} />}
      {!item && <View style={styles.button} />}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    bottom: 40,
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: defaultBlack.lv2(1),
    borderRadius: 20,
  },
});
