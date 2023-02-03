import messaging from '@react-native-firebase/messaging';
import React, {useContext, useEffect, useState} from 'react';
import AuthUserContext from '../../contexts/AuthUser';
import {signIn} from '../../functions/User';

import Notify from './Notifications';

const Permission = () => {
  const {authUserData} = useContext(AuthUserContext);
  const [isChecked, setIsChecked] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);

  // check and request notification permission
  useEffect(() => {
    let isMounted = true;
    const checkPermission = async () => {
      const getPermission = async () => {
        // On Android, you do not need to request user permission.
        // This method can still be called on Android devices; however, and will always resolve successfully.
        const authStatus = await messaging().requestPermission();

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        setIsPermitted(enabled);

        if (enabled) {
          const newToken = await messaging().getToken();

          if (authUserData?.token !== newToken) {
            try {
              await signIn({user: {token: newToken, id: authUserData.id}});
            } catch (error) {}
          }
        }
      };
      await getPermission();

      if (isMounted) {
        setIsChecked(true);
      }
    };

    if (authUserData && !isChecked) {
      checkPermission();
    }

    return () => {
      isMounted = false;
    };
  }, [authUserData, isChecked]);

  return <Notify isPermitted={isPermitted} />;
};

export default Permission;
