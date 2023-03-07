import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {getNewMoments} from '../../utils/Moment';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  style: TStyleView;
};

const UserButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const numberOfNewContents = getNewMoments({authUserData}).length;

  return (
    <Pressable
      style={style}
      onPress={() => {
        onUpdate({target: 'user', data: {id: authUserData.id}});
      }}>
      <DefaultIcon icon="user" size={20} color="gray" />
      {numberOfNewContents >= 1 && (
        <DefaultText
          title={numberOfNewContents.toString()}
          style={styles.badge}
          textStyle={styles.badgeText}
        />
      )}
    </Pressable>
  );
};

export default UserButton;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 10,
    top: -5,
    backgroundColor: defaultRed.lv1,
    padding: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  badgeText: {fontWeight: 'bold'},
});
