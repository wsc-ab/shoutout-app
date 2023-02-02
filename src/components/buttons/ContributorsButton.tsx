import React, {useContext} from 'react';
import {Pressable, ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TTimestamp} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import UserModal from '../modals/UserModal';

type TProps = {
  users: {
    name: string;
    id: string;
    thumbnail?: string;
    location?: {name: string};
    createdAt: TTimestamp;
  }[];
  index: number;
  style?: ViewStyle;
};

const ContributorsButton = ({users, index, style}: TProps) => {
  const {onUpdate, modal} = useContext(ModalContext);

  return (
    <ScrollView style={style} horizontal showsHorizontalScrollIndicator={false}>
      {users.map((user, elIndex) => {
        return (
          <View style={styles.container} key={user.id + elIndex}>
            <Pressable
              onPress={() => onUpdate('user')}
              style={[styles.user, elIndex === index && styles.current]}>
              <DefaultIcon icon="user" style={styles.icon} />
              <View>
                <DefaultText title={user.name} textStyle={styles.nameText} />
                {user.location && <DefaultText title={user.location.name} />}
                <DefaultText title={getTimeSinceTimestamp(user.createdAt)} />
              </View>
            </Pressable>
            {elIndex !== users.length - 1 && <DefaultIcon icon="angle-right" />}
            {modal === 'user' && (
              <UserModal id={user.id} onCancel={() => onUpdate(undefined)} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ContributorsButton;

const styles = StyleSheet.create({
  container: {alignItems: 'center', flexDirection: 'row'},
  user: {flexDirection: 'row', marginRight: 10, alignItems: 'center'},
  current: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: defaultBlack.lv2,
    padding: 5,
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
  nameText: {fontWeight: 'bold'},
});
