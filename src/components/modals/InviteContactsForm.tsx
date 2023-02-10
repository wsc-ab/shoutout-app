import React, {useContext} from 'react';
import AuthUserContext from '../../contexts/AuthUser';
import ContactsContext from '../../contexts/Contacts';
import {createShareLink} from '../../utils/Share';
import DefaultForm from '../defaults/DefaultForm';
import openShareModal from './ShareModal';

type TProps = {
  onSuccess: () => void;
  onCancel: () => void;
  details?: string[];
};

const InviteContactsForm = ({details, onSuccess, onCancel}: TProps) => {
  const {contacts} = useContext(ContactsContext);
  const {bundleId, authUserData} = useContext(AuthUserContext);

  const onInviteContact = async () => {
    const target =
      bundleId === 'app.airballoon.Shoutout' ? 'development' : 'production';
    const inviteLink = await createShareLink({
      target,
      param: 'users',
      value: authUserData.id,
      image: {path: authUserData.thumbnail, type: 'image'},
    });

    await openShareModal({
      title: "Let's connect our live moments on Shoutout!",
      url: inviteLink,
    });
  };

  const onPressDone = onSuccess;

  return <DefaultForm title="Invite" />;
};

export default InviteContactsForm;
