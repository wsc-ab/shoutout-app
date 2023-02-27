import React, {createContext, useContext, useState} from 'react';
import {TObject} from '../types/Firebase';
import AuthUserContext from './AuthUser';
import ModalContext from './Modal';
import PopupContext from './Popup';

type TTarget = {
  collection: string;
  id: string;
  data: TObject;
};

type TContextProps = {
  target?: TTarget;
  status: 'ready' | 'uploading' | 'error' | 'done';
  onUpload: ({
    target,
    status,
  }: {
    target: TTarget;
    status: TContextProps['status'];
  }) => void;
};

const UploadingContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const UploadingProvider = ({children}: TProps) => {
  const [target, setTarget] = useState<TContextProps['target']>();
  const {addPopup} = useContext(PopupContext);
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const [status, setStatus] = useState<TContextProps['status']>('ready');

  const onUpload: TContextProps['onUpload'] = ({
    target: newTarget,
    status: newStatus,
  }) => {
    setStatus(newStatus);
    setTarget(newTarget);

    if (newStatus === 'uploading') {
      addPopup({
        icon: 'square-plus',
        dismissable: false,
      });
    } else {
      addPopup({
        title: 'Uploaded',
        dismissable: true,
        onPress: () => onUpdate({target: 'user', data: {id: authUserData.id}}),
      });
    }
  };

  return (
    <UploadingContext.Provider
      value={{
        target,
        status,
        onUpload,
      }}>
      {children}
    </UploadingContext.Provider>
  );
};

export {UploadingProvider};
export default UploadingContext;
