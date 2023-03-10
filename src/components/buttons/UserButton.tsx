import React, {useContext} from 'react';
import {Pressable} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style: TStyleView;
};

const UserButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      style={style}
      onPress={() => {
        onUpdate({target: 'auth'});
      }}>
      <DefaultIcon icon="user" size={20} color="gray" />
    </Pressable>
  );
};

export default UserButton;
