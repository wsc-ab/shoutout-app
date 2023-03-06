import React, {ReactNode} from 'react';
import {TStyleView} from '../../types/Style';
import DefaultForm from './DefaultForm';
import DefaultModal from './DefaultModal';

type TProps = {
  children: ReactNode;
  style?: TStyleView;
  onCancel: () => void;
  title: string;
};

const DetailModal = ({children, title, onCancel}: TProps) => {
  return (
    <DefaultModal>
      <DefaultForm title={title} left={{onPress: onCancel}}>
        {children}
      </DefaultForm>
    </DefaultModal>
  );
};

export default DetailModal;
