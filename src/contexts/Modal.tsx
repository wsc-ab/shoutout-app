import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useEffect, useState} from 'react';
import AddMomentForm from '../components/forms/AddMomentForm';
import CreateMomentForm from '../components/forms/CreateMomentForm';
import AuthUserModal from '../components/modals/AuthUserModal';
import ContactsModal from '../components/modals/ContactsModal';
import MomentModal from '../components/modals/MomentModal';
import UserModal from '../components/modals/UserModal';
import {getLinkData} from '../utils/Share';

type TModal = {
  target: string;
  id?: string;
  path?: string;
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

        if (collection) {
          onUpdate({target: collection, id});
        }
      }
    };

    loadInitialLink();
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(link => {
      const {collection, id} = getLinkData(link);
      if (collection) {
        onUpdate({target: collection, id});
      }
    });
    return () => unsubscribe();
  }, []);

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
      {modal?.target === 'moments' && modal.id && (
        <MomentModal id={modal.id} path={modal.path} />
      )}
      {modal?.target === 'create' && <CreateMomentForm {...modal.data} />}
      {modal?.target === 'add' && <AddMomentForm {...modal.data} />}
      {modal?.target === 'auth' && <AuthUserModal />}
      {modal?.target === 'friends' && <ContactsModal />}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
