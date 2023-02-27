import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  style?: TStyleView;
};

const ContactButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);
  const numberOfRequests =
    authUserData.followFrom.number - authUserData.followTo.number;

  return (
    <Pressable
      style={style}
      onPress={() => {
        onUpdate({target: 'friends'});
      }}>
      <DefaultIcon icon="address-book" size={20} />
      {numberOfRequests >= 1 && (
        <DefaultText
          title={numberOfRequests.toString()}
          style={styles.badge}
          textStyle={styles.badgeText}
        />
      )}
    </Pressable>
  );
};

export default ContactButton;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 0,
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
