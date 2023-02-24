import auth from '@react-native-firebase/auth';
import React, {useContext, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import CacheContext from '../../contexts/Cache';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';

import {deleteUser, updateUserProfileImage} from '../../functions/User';
import {getImage} from '../../utils/Image';

import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {};

const AuthUserModal = ({}: TProps) => {
  const {onSignOut, authUserData, onReload} = useContext(AuthUserContext);
  const {onClear} = useContext(CacheContext);
  const {onUpdate} = useContext(ModalContext);
  const {addUpload, removeUpload} = useContext(UploadingContext);

  const [cacheClearing, setCacheClearing] = useState<boolean>();

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

  const onCacheClear = async () => {
    setCacheClearing(true);
    await onClear();
    setCacheClearing(false);
  };

  const [imageUploading, setImageUploading] = useState(false);

  const onProfileImage = async () => {
    try {
      setImageUploading(true);

      const uri = await getImage();
      addUpload({
        type: 'profileImage',
        remotePath: `${authUserData.id}/images/profileImage`,
        localPath: uri,
      });
      await updateUserProfileImage({uri, user: {id: authUserData.id}});
      removeUpload({
        type: 'profileImage',
        remotePath: `${authUserData.id}/images/profileImage`,
        localPath: uri,
      });
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: 'Failed to change profile image.',
      });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <DefaultModal>
      <DefaultForm
        title={'Settings'}
        left={{onPress: () => onUpdate(undefined)}}
        right={{
          icon: 'user',
          onPress: () => {
            onUpdate({target: 'user', data: {id: authUserData.id}});
          },
        }}>
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
              flexDirection: 'row',
            }}>
            <DefaultText title="ID" textStyle={{fontWeight: 'bold'}} />
            <DefaultText
              title={authUserData.displayName}
              style={{
                marginLeft: 10,
              }}
            />
          </View>
          <View
            style={{
              marginTop: 20,
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
            title={
              imageUploading ? 'Changing profile image' : 'Change profile image'
            }
            onPress={imageUploading ? undefined : onProfileImage}
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
            title={
              cacheClearing === undefined
                ? 'Clear cache'
                : cacheClearing
                ? 'Clearing cache'
                : 'Cleared cache'
            }
            onPress={cacheClearing === undefined ? onCacheClear : undefined}
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
