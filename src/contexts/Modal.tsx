import React, {createContext, useState} from 'react';
import ChannelModal from '../components/channel/ChannelModal';
import ChannelSearchModal from '../components/channel/ChannelSearchModal';

import AuthUserModal from '../components/modals/AuthUserModal';

import ContactsModal from '../components/modals/ContactsModal';
import UserModal from '../components/user/UserModal';
import {TObject} from '../types/Firebase';

type TModal = {
  target: string;
  data?: TObject;
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

  const onCancel = () => {
    onUpdate(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        onUpdate,
      }}>
      {children}
      {modal?.target === 'channel' && modal.data?.channel && (
        <ChannelModal channel={modal.data.channel} moment={modal.data.moment} />
      )}
      {modal?.target === 'auth' && <AuthUserModal />}
      {modal?.target === 'friends' && <ContactsModal />}
      {modal?.target === 'search' && <ChannelSearchModal />}
      {modal?.target === 'user' && modal.data?.user && (
        <UserModal user={modal.data?.user} onCancel={onCancel} />
      )}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
