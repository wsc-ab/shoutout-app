import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useEffect, useState} from 'react';
import AddMomentForm from '../components/forms/AddMomentForm';
import CreateMomentForm from '../components/forms/CreateMomentForm';
import CreateRoomForm from '../components/forms/CreateRoomForm';
import AuthUserModal from '../components/modals/AuthUserModal';
import ContactsModal from '../components/modals/ContactsModal';
import MomentModal from '../components/modals/MomentModal';
import RoomModal from '../components/modals/RoomModal';
import UserModal from '../components/modals/UserModal';
import UsersModal from '../components/modals/UsersModal';
import {TObject} from '../types/Firebase';
import {getShareLinkData} from '../utils/Share';

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

  useEffect(() => {
    const loadInitialLink = async () => {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        const {collection, id} = getShareLinkData(initialLink);

        if (collection) {
          onUpdate({target: collection, data: {id}});
        }
      }
    };

    loadInitialLink();
  }, []);

  useEffect(() => {
    const unsub = dynamicLinks().onLink(link => {
      const {collection, id} = getShareLinkData(link);

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
      {modal?.target === 'user' && modal.data?.id && (
        <UserModal id={modal.data.id} />
      )}
      {modal?.target === 'moment' && modal.data?.id && (
        <MomentModal id={modal.data.id} path={modal.data.path} />
      )}
      {modal?.target === 'room' && modal.data?.room && (
        <RoomModal room={modal.data.room} />
      )}
      {modal?.target === 'createRoom' && <CreateRoomForm {...modal.data} />}
      {modal?.target === 'createMoment' && modal.data && (
        <CreateMomentForm {...modal.data} />
      )}

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
