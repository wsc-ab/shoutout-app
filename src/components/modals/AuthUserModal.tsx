import React, {useContext, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {deleteUser} from '../../functions/User';
import LinkButton from '../buttons/LinkButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import UserModal from './UserModal';

type TProps = {
  onCancel: () => void;
};

const AuthUserModal = ({onCancel}: TProps) => {
  const {onSignOut, authUserData, authUser, onReload} =
    useContext(AuthUserContext);

  const onDelete = async () => {
    const onPress = async () => {
      try {
        await deleteUser({user: {id: authUserData.id}});
        onSignOut();
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
    };

    DefaultAlert({
      title: 'Delete user?',
      message:
        "Your data will be removed, and you can't restore data once you delete your account",
      buttons: [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  const [modal, setModal] = useState<'profile' | 'setting'>();

  return (
    <DefaultModal>
      <DefaultForm title={authUserData.name} left={{onPress: onCancel}}>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onReload}
              tintColor="lightgray"
            />
          }>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <DefaultText title="Phone" textStyle={{fontWeight: 'bold'}} />
            <DefaultText
              title={authUser?.phoneNumber!}
              style={{
                marginLeft: 10,
              }}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
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
                title={'Not verified'}
                onPress={async () => {
                  DefaultAlert({
                    title: 'Email sent',
                    message:
                      'We have just sent a verification email. Refresh this page once you have pressed the verification link.',
                  });

                  await authUser?.sendEmailVerification();
                }}
                style={{
                  marginTop: 5,
                }}
              />
            )}
          </View>
          <LinkButton links={authUserData?.links} style={{marginTop: 20}} />
          <View
            style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
          />
          <DefaultText
            title="View profile"
            onPress={() => setModal('profile')}
          />
          <DefaultText
            title="Edit profile"
            onPress={() => {
              DefaultAlert({
                title: 'Not yet developed',
                message: "We'll launch this feature soon",
              });
            }}
            style={{marginTop: 20}}
          />
          <DefaultText
            title="Sign out"
            onPress={onSignOut}
            style={{marginTop: 20}}
          />
          <DefaultText
            title="Delete account"
            onPress={onDelete}
            style={{marginTop: 20}}
          />
        </ScrollView>
      </DefaultForm>
      {modal === 'profile' && (
        <UserModal id={authUserData.id} onCancel={() => setModal(undefined)} />
      )}
    </DefaultModal>
  );
};

export default AuthUserModal;
