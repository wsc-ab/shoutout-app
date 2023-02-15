import React, {useContext} from 'react';
import {View} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
};

const ContactButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <View style={style}>
      <DefaultIcon
        icon="address-book"
        size={20}
        onPress={() => {
          onUpdate({target: 'friends'});
        }}
      />
    </View>
  );
};

export default ContactButton;
