import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useEffect, useState} from 'react';
import AuthUserModal from '../components/modals/AuthUserModal';
import RollModal from '../components/modals/RollModal';
import UserModal from '../components/modals/UserModal';
import {getLinkData} from '../utils/Share';

type TModal = {
  target: string;
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

  useEffect(() => {
    const loadInitialLink = async () => {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        const {collection, id} = getLinkData(initialLink);

        onUpdate({target: collection, id});
      }
    };

    loadInitialLink();
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(link => {
      const {collection, id} = getLinkData(link);
      onUpdate({target: collection, id});
    });
    return () => unsubscribe();
  }, []);

  const onUpdate = (newModal?: TModal) => {
    setModal(undefined);
    if (newModal) {
      setModal(newModal);
    }
  };

  console.log(modal, 'm');

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
      {modal?.target === 'contacts' && <AuthUserModal />}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
