import React, {useContext} from 'react';
import {Alert, RefreshControl, ScrollView, View} from 'react-native';
import AuthUserContext from '../contexts/AuthUser';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import {deleteUser} from '../functions/User';

type TProps = {
  onCancel: () => void;
};

const UserModal = ({onCancel}: TProps) => {
  const {onSignOut, authUserData, authUser, onReload} =
    useContext(AuthUserContext);

  const onDelete = async () => {
    await deleteUser({user: {id: authUserData.id}});
    onSignOut();
  };

  return (
    <DefaultModal>
      <DefaultForm title={'Me'} left={{title: 'Back', onPress: onCancel}}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onReload} />
          }>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
            }}>
            <DefaultText title="ID" textStyle={{fontWeight: 'bold'}} />
            <DefaultText
              title={authUserData.name}
              style={{
                marginLeft: 10,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <DefaultText title="Email" textStyle={{fontWeight: 'bold'}} />
            <DefaultText
              title={authUser?.email!}
              style={{
                marginLeft: 10,
              }}
            />
          </View>
          {!authUser?.emailVerified && (
            <DefaultText
              title={'Please verify your email.'}
              onPress={async () => {
                Alert.alert(
                  'Please check your email',
                  'We have just sent a verification email. Refresh this page once you have pressed the verification link.',
                );
                await authUser?.sendEmailVerification();
              }}
              style={{
                marginTop: 5,
              }}
            />
          )}
          <View
            style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
          />
          <DefaultText title="Sign out" onPress={onSignOut} />
          <DefaultText
            title="Delete account"
            onPress={onDelete}
            style={{marginTop: 20}}
          />
        </ScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default UserModal;
