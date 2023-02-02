import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {TDocData} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  moment: TDocData;
  style?: ViewStyle;
};

const ContributorButton = ({moment, style}: TProps) => {
  return (
    <View style={style}>
      <View style={styles.container}>
        <DefaultIcon icon="user" style={styles.icon} />
        <View>
          <DefaultText
            title={moment.contributeFrom?.items[0].name}
            textStyle={styles.nameText}
          />
          {moment.location?.name && (
            <DefaultText title={moment.location.name} />
          )}
          <DefaultText title={getTimeSinceTimestamp(moment.createdAt)} />
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
