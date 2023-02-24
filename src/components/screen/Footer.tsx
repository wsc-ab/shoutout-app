import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import AddMomentButton from '../buttons/AddMomentButton';
import CreateMomentButton from '../buttons/CreateMomentButton';
import LikeButton from '../buttons/LikeButton';
import ReportButton from '../buttons/ReportButton';
import ShareButton from '../buttons/ShareButton';
import {defaultBlack} from '../defaults/DefaultColors';

type TProps = {
  content: {
    id: string;
    path: string;
    user: {id: string};
  };
  moment: {id: string};
  added: boolean;
  style?: TStyleView;
};

const Footer = ({content, moment, added, style}: TProps) => {
  return (
    <View style={[styles.container, style]}>
      <LikeButton
        moment={{
          id: content.id,
          path: content.path,
          user: {id: content.user.id},
        }}
        style={styles.button}
      />

      <AddMomentButton moment={moment} style={styles.button} added={added} />
      <CreateMomentButton style={styles.button} />
      <ShareButton
        input={{
          title:
            'Hey! Check this moment out! You can also connect yours to it!',
          param: 'moments',
          value: content.id,
          image: {path: content.path, type: 'video'},
        }}
        style={styles.button}
      />

      <ReportButton
        moment={{
          id: content.id,
          path: content.path,
          user: {id: content.user.id},
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
