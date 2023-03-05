import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {createContext, useContext, useEffect, useState} from 'react';
import AddMomentForm from '../components/forms/AddMomentForm';
import ChannelCodeForm from '../components/forms/ChannelCodeForm';
import CreateChannelForm from '../components/forms/CreateChannelForm';
import AuthUserModal from '../components/modals/AuthUserModal';
import ContactsModal from '../components/modals/ContactsModal';
import MomentsModal from '../components/modals/MomentsModal';
import ChannelModal from '../components/modals/RoomModal';
import UserModal from '../components/modals/UserModal';
import UsersModal from '../components/modals/UsersModal';
import {TObject} from '../types/Firebase';
import {getQueryParams} from '../utils/Share';
import AuthUserContext from './AuthUser';

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
  const {authUserData} = useContext(AuthUserContext);

  useEffect(() => {
    const loadInitialLink = async () => {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        const {collection, id, path} = getQueryParams(initialLink.url);

        if (collection === 'moments') {
          onUpdate({
            target: 'moments',
            data: {moments: [{id}], contentPath: path},
          });
        } else if (collection) {
          onUpdate({target: collection.slice(0, -1), data: {id, path}});
        }
      }
    };

    if (authUserData) {
      loadInitialLink();
    }
  }, [authUserData]);

  useEffect(() => {
    if (authUserData) {
      const unsub = dynamicLinks().onLink(link => {
        const {collection, id, path} = getQueryParams(link.url);

        if (collection === 'moments') {
          onUpdate({
            target: 'moments',
            data: {moments: [{id}], contentPath: path},
          });
        } else if (collection) {
          onUpdate({target: collection.slice(0, -1), data: {id, path}});
        }
      });
      return () => unsub();
    }
  }, [authUserData]);

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
      {modal?.target === 'moments' && modal.data && (
        <MomentsModal
          moments={modal.data.moments}
          momentIndex={modal.data.momentIndex}
          contentPath={modal.data.contentPath}
        />
      )}
      {modal?.target === 'channel' && modal.data?.channel && (
        <ChannelModal channel={modal.data.channel} path={modal.data.path} />
      )}
      {modal?.target === 'createChannel' && (
        <CreateChannelForm {...modal.data} />
      )}
      {modal?.target === 'auth' && <AuthUserModal />}
      {modal?.target === 'friends' && <ContactsModal />}
      {modal?.target === 'channelUsers' && modal.data && (
        <UsersModal users={modal.data.users} channel={modal.data.channel} />
      )}
      {modal?.target === 'addMoment' && modal.data && (
        <AddMomentForm {...modal.data} />
      )}
      {modal?.target === 'channelCode' && <ChannelCodeForm />}
    </ModalContext.Provider>
  );
};

export {ModalProvider};
export default ModalContext;
