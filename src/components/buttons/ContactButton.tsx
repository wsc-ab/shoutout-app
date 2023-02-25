import React, {useContext} from 'react';
import {Pressable} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
};

const ContactButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);
  const hasFriendRequests =
    authUserData.followTo.number < authUserData.followFrom.number;

  return (
    <Pressable
      style={style}
      onPress={() => {
        onUpdate({target: 'friends'});
      }}>
      <DefaultIcon icon="address-book" size={20} />
      {hasFriendRequests && (
        <DefaultIcon
          icon="exclamation"
          color={defaultRed.lv2}
          style={{
            position: 'absolute',
            right: -5,
            top: -5,
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 20,
          }}
        />
      )}
    </Pressable>
  );
};

export default ContactButton;
