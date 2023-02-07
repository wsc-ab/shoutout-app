import {parsePhoneNumber} from 'libphonenumber-js/mobile';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {getAllWithoutPhotos} from 'react-native-contacts';

import {checkPhoneNumbers} from '../https/User';
import {TCheckPhoneNumbersOutput} from '../types';
import {TStatus} from '../types/Common';
import {notEmpty, sortByName} from '../utils/Array';
import AuthUserContext from './AuthUser';

type TContextProps = {
  exisitingContacts: TCheckPhoneNumbersOutput['existingContacts'];
  inviteContacts: TCheckPhoneNumbersOutput['newContacts'];
  status: TStatus;
  reload: () => void;
};

const ContactsContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const ContactsProvider = ({children}: TProps) => {
  const [inviteContacts, setInviteContacts] = useState<
    TCheckPhoneNumbersOutput['newContacts']
  >([]);

  const [exisitingContacts, setExistingContacts] = useState<
    TCheckPhoneNumbersOutput['existingContacts']
  >([]);

  const [status, setStatus] = useState<TStatus>('loading');
  const {authUser} = useContext(AuthUserContext);

  const reload = () => setStatus('loading');

  useEffect(() => {
    let isMounted = true;
    const loadContacts = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
            buttonPositive: 'Please accept bare mortal',
          },
        );
      }

      try {
        const contacts = await getAllWithoutPhotos();

        const labels = ['mobile', '휴대전화', 'iPhone'];

        const filtered = contacts.filter(
          contact =>
            contact.phoneNumbers.filter(({label}) => labels.includes(label))
              .length >= 1,
        );

        const mobileOnly = filtered
          .map(({phoneNumbers, givenName, familyName}) => {
            const country = 'US';

            const parsed = parsePhoneNumber(phoneNumbers[0].number, country);

            if (parsed?.getType() === 'MOBILE') {
              return {
                name: `${familyName} ${givenName}`,
                phoneNumber: parsed.number,
                countryCode: parsed.country ?? 'ko',
              };
            }
          })
          .filter(notEmpty);

        // get existing contacts
        const {
          existingContacts: loadedExisitingContacts,
          newContacts: loadedNewContacts,
        } = await checkPhoneNumbers({
          contacts: mobileOnly,
        });

        if (isMounted) {
          setExistingContacts(
            sortByName(
              loadedExisitingContacts.filter(({id}) => id !== authUser.id),
              'name',
            ),
          );
          setInviteContacts(sortByName(loadedNewContacts, 'name'));
          setStatus('loaded');
        }
      } catch (error) {
        setStatus('reload');
      }
    };

    if (status === 'loading') {
      loadContacts();
    }

    return () => {
      isMounted = false;
    };
  }, [authUser?.id, status]);

  return (
    <ContactsContext.Provider
      value={{
        reload,
        exisitingContacts,
        status,
        inviteContacts,
      }}>
      {children}
    </ContactsContext.Provider>
  );
};

export {ContactsProvider};
export default ContactsContext;
