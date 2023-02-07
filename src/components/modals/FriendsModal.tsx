import React, {useContext, useState} from 'react';
import AuthUserContext from '../../contexts/AuthUser';
import DefaultModal from '../defaults/DefaultModal';
import InviteContactsForm from './InviteContactsForm';

type TProps = {
  onCancel: () => void;
  onSuccess: () => void;
  numberOfItems?: number;
};

const FriendsModal = ({onCancel, onSuccess}: TProps) => {
  const tabs = [
    {value: 'invite', title: 'Invite'},
    {value: 'friends', title: 'Friends'},
  ];
  const [tab, setTab] = useState(tabs[0].value);
  const {authUser} = useContext(AuthUserContext);

  return (
    <DefaultModal>
      {tab === 'invite' && (
        <InviteContactsForm
          onCancel={onCancel}
          onSuccess={onSuccess}
          details={['Invite friends']}
        />
      )}
    </DefaultModal>
  );
};

export default FriendsModal;

export const friendOptions = {
  followTo: {title: 'Following'},
  followFrom: {title: 'Accept'},
  followToFrom: {title: 'Friends'},
  none: {title: ' Follow'},
};
