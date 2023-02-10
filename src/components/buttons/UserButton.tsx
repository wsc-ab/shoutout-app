import React, {useContext} from 'react';
import {View} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style: TStyleView;
};

const UserButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <View style={style}>
      <DefaultIcon
        icon="user"
        size={25}
        onPress={() => {
          onUpdate({target: 'auth'});
        }}
      />
    </View>
  );
};

export default UserButton;
