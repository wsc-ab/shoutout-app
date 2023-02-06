import auth from '@react-native-firebase/auth';
import React, {useContext} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import UserModalContext from '../../contexts/UserModal';

import {deleteUser} from '../../functions/User';

import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  onCancel: () => void;
};

const AuthUserModal = ({onCancel}: TProps) => {
  const {onSignOut, authUserData, onReload} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const {onUpdate: onUpdateUser} = useContext(UserModalContext);

  const onDelete = async () => {
    const onPress = async () => {
      try {
        await deleteUser({user: {id: authUserData.id}});
        onUpdate(undefined);
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
      message: "Your data will be removed, and you can't restore data.",
      buttons: [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  const currentUser = auth().currentUser;

  return (
    <DefaultModal>
      <DefaultForm title={authUserData.displayName} left={{onPress: onCancel}}>
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
              title={authUserData?.phoneNumber!}
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
                title={authUserData?.email!}
                style={{
                  marginLeft: 10,
                }}
              />
            </View>
            {!currentUser?.emailVerified && (
              <DefaultText
                title={'Not verified'}
                onPress={async () => {
                  DefaultAlert({
                    title: 'Email sent',
                    message:
                      'We have just sent a verification email. Refresh this page once you have pressed the verification link.',
                  });

                  await currentUser?.sendEmailVerification();
                }}
                style={{
                  marginTop: 5,
                }}
              />
            )}
          </View>
          <View
            style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
          />
          <DefaultText
            title="View profile"
            onPress={() => {
              onCancel();
              onUpdateUser({id: authUserData.id});
            }}
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
            onPress={() => {
              onUpdate(undefined);
              onSignOut();
            }}
            style={{marginTop: 20}}
          />
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

export default AuthUserModal;
