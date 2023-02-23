import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useEffect, useState} from 'react';
import AddContentForm from '../components/forms/AddContentForm';
import AddMomentForm from '../components/forms/AddMomentForm';
import CreatePromptForm from '../components/forms/CreatePromptForm';
import AuthUserModal from '../components/modals/AuthUserModal';
import ContactsModal from '../components/modals/ContactsModal';
import MomentModal from '../components/modals/MomentModal';
import PromptModal from '../components/modals/PromptModal';
import UserModal from '../components/modals/UserModal';
import UsersModal from '../components/modals/UsersModal';
import {TTimestamp} from '../types/Firebase';
import {getLinkData} from '../utils/Share';

type TModal = {
  target: string;
  data?: {
    id?: string;
    remotePath?: string;
    localPath?: string;
    path?: string;
    users?: {
      id: string;
      displayName: string;
      moment: {path: string; addedAt: TTimestamp};
    }[];
  };
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
          onUpdate({target: collection, data: {id}});
        }
      }
    };

    loadInitialLink();
  }, []);

  useEffect(() => {
    const unsub = dynamicLinks().onLink(link => {
      const {collection, id} = getLinkData(link);
      if (collection) {
        onUpdate({target: collection, data: {id}});
      }
    });
    return () => unsub();
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
      {modal?.target === 'users' && modal.data?.id && (
        <UserModal id={modal.data.id} />
      )}
      {modal?.target === 'moments' && modal.data?.id && (
        <MomentModal id={modal.data.id} path={modal.data.path} />
      )}
      {modal?.target === 'prompts' && modal.data?.id && (
        <PromptModal id={modal.data.id} path={modal.data.path} />
      )}
      {modal?.target === 'create' && <CreatePromptForm {...modal.data} />}
      {modal?.target === 'addContent' && <AddContentForm {...modal.data} />}
      {modal?.target === 'addMoment' && modal.data && (
        <AddMomentForm {...modal.data} />
      )}
      {modal?.target === 'auth' && <AuthUserModal />}
      {modal?.target === 'friends' && <ContactsModal />}
      {modal?.target === 'promptUsers' && modal.data?.users && (
        <UsersModal users={modal.data.users} />
      )}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
