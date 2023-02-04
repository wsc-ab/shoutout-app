import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {TLocation, TTimestamp} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import LocationButton from './LocationButton';

type TProps = {
  item: {
    id: string;
    path: string;
    user: {id: string; displayName: string};
    location?: TLocation;
    addedAt: TTimestamp;
  };
  style?: ViewStyle;
};

const ContributorButton = ({item, style}: TProps) => {
  return (
    <View style={style}>
      <View style={styles.container}>
        <DefaultIcon icon="user" style={styles.icon} />
        <View>
          <DefaultText
            title={item.user.displayName}
            textStyle={styles.nameText}
          />
          <LocationButton location={item.location} />
          <DefaultText title={getTimeSinceTimestamp(item.addedAt)} />
        </View>
      </View>
    </View>
  );
};

export default ContributorButton;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginRight: 5,
    backgroundColor: defaultBlack.lv3,
  },
  nameText: {fontWeight: 'bold'},
});
