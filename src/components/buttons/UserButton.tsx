import React, {useContext} from 'react';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style: TStyleView;
};

const UserButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  return (
    <DefaultIcon
      icon="user"
      size={20}
      style={style}
      onPress={() => {
        onUpdate({target: 'users', data: {id: authUserData.id}});
      }}
    />
  );
};

export default UserButton;
