import React, {createContext, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {Contact, getAllWithoutPhotos} from 'react-native-contacts';
import {TStatus} from '../types/Screen';

type TContextProps = {
  contacts: Contact[];
  status: TStatus;
  reload: () => void;
};

const ContactsContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const ContactsProvider = ({children}: TProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [status, setStatus] = useState<TStatus>('loading');

  const reload = () => setStatus('loading');

  useEffect(() => {
    const loadContacts = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts',
            message: 'This lets you share moments with friends.',
            buttonPositive: 'Accept',
          },
        );
      }

      try {
        const newContacts = await getAllWithoutPhotos();
        setContacts(newContacts);
        setStatus('loaded');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      loadContacts();
    }
  }, [status]);

  return (
    <ContactsContext.Provider
      value={{
        reload,
        contacts,
        status,
      }}>
      {children}
    </ContactsContext.Provider>
  );
};

export {ContactsProvider};
export default ContactsContext;
