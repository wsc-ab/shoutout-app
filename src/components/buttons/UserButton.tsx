import React, {useContext} from 'react';
import {View} from 'react-native';
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
    <View style={style}>
      <DefaultIcon
        icon="user"
        size={20}
        onPress={() => {
          onUpdate({target: 'users', id: authUserData.id});
        }}
      />
    </View>
  );
};

export default UserButton;
