import React from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import {TTimestamp} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  users: {
    name: string;
    id: string;
    thumbnail?: string;
    location?: {name: string};
    addedAt: TTimestamp;
  }[];
  index: number;
  style?: ViewStyle;
};

const ContributorsButton = ({users, index, style}: TProps) => {
  return (
    <ScrollView style={style} horizontal showsHorizontalScrollIndicator={false}>
      {users.map((user, elIndex) => {
        const isCurrent = elIndex === index;
        return (
          <View
            style={[styles.container, isCurrent && styles.current]}
            key={user.id + elIndex}>
            {isCurrent && <DefaultIcon icon="user" style={styles.icon} />}
            <View>
              <DefaultText title={user.name} textStyle={styles.nameText} />
              {user.location && <DefaultText title={user.location.name} />}
              {isCurrent && (
                <DefaultText title={getTimeSinceTimestamp(user.addedAt)} />
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ContributorsButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 10,
    backgroundColor: defaultBlack.lv5,
    borderRadius: 10,
    flexDirection: 'row',
  },
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginRight: 5,
    backgroundColor: defaultBlack.lv3,
  },
  current: {backgroundColor: defaultBlack.lv2},
  nameText: {fontWeight: 'bold'},
});
