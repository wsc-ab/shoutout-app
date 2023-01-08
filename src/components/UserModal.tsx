import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
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
        <DefaultText title="My content of the day" textStyle={styles.header} />
        <DefaultText title="This will be submitted at 11:59 pm today" />
        <DefaultText
          title="Sign out"
          onPress={onSignOut}
          style={styles.textInput}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  header: {fontSize: 20, fontWeight: 'bold'},
  textInput: {
    marginTop: 10,
  },
});
