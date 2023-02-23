import React, {useContext} from 'react';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: TStyleView;
};

const ContactButton = ({style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <DefaultIcon
      icon="address-book"
      style={style}
      size={20}
      onPress={() => {
        onUpdate({target: 'friends'});
      }}
    />
  );
};

export default ContactButton;
