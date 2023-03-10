import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  id: string;
  displayName: string;
  style?: TStyleView;
};

const ChannelUserCard = ({id, displayName, style}: TProps) => {
  return (
    <Pressable style={style}>
      <View style={styles.body}>
        <UserProfileImage user={{id}} />
        <View style={{marginLeft: 10}}>
          <DefaultText
            title={displayName}
            style={styles.displayName}
            textStyle={styles.displayNameText}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default ChannelUserCard;

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {marginBottom: 5},
  displayNameText: {fontWeight: 'bold'},
});
