import React, {createContext, useState} from 'react';
import AuthUserModal from '../components/modals/AuthUserModal';
import RollModal from '../components/modals/RollModal';
import UserModal from '../components/modals/UserModal';

type TModal = {
  target: 'moments' | 'users' | 'auth' | 'video';
  id?: string;
};

type TContextProps = {
  onUpdate: (modal?: TModal) => void;
  modal?: TModal;
};

const ModalContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const ModalProvider = ({children}: TProps) => {
  const [modal, setModal] = useState<TModal>();

  const onUpdate = (newModal?: TModal) => {
    setModal(undefined);
    if (newModal) {
      setModal(newModal);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        onUpdate,
      }}>
      {children}
      {modal?.target === 'users' && modal.id && <UserModal id={modal.id} />}
      {modal?.target === 'moments' && modal.id && <RollModal id={modal.id} />}
      {modal?.target === 'auth' && <AuthUserModal />}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
