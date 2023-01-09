import React, {useContext} from 'react';
import AuthUserContext from '../contexts/AuthUser';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  onCancel: () => void;
};

const UserModal = ({onCancel}: TProps) => {
  const {onSignOut} = useContext(AuthUserContext);

  return (
    <DefaultModal>
      <DefaultForm title={'Me'} left={{title: 'Back', onPress: onCancel}}>
        <DefaultText title="Sign out" onPress={onSignOut} />
        <DefaultText
          title="Delete account"
          onPress={onSignOut}
          style={{marginTop: 20}}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default UserModal;
