import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {loadFromCache} from '../../utils/Cache';
import {
  getUserProfileImagePath,
  getUserProfileImageThumbPath,
} from '../../utils/Storage';

import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import UserModal from '../user/UserModal';

export const getThumnailPath = (url: string) => url + '_200x200';

export type Props = {
  user: {id: string};
  style?: TStyleView;
  imageStyle?: {height: number; width: number};
};

const UserProfileImage = ({
  style,
  user,
  imageStyle = {height: 50, width: 50},
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [modal, setModal] = useState<'user'>();
  const [status, setStatus] = useState<TStatus>('loading');

  const {id} = user;

  useEffect(() => {
    let isMounted = true;
    const loadImageUrl = async () => {
      const remoteThumbPath = getUserProfileImageThumbPath(id);

      try {
        const localPath = await loadFromCache({remotePath: remoteThumbPath});

        setImageUrl(localPath);
      } catch (e) {
        try {
          const localPath = await loadFromCache({
            remotePath: getUserProfileImagePath(id),
          });
          setImageUrl(localPath);
        } catch (error) {
          setStatus('error');
        }
      } finally {
        isMounted && setStatus('loaded');
      }
    };

    loadImageUrl();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <View>
      {(!imageUrl || status === 'error') && (
        <DefaultIcon
          icon="user"
          style={[styles.icon, imageStyle]}
          size={imageStyle.height / 3}
          onPress={() => {
            console.log('modal called');

            setModal('user');
          }}
        />
      )}
      {imageUrl && status === 'loaded' && (
        <Pressable style={style} onPress={() => setModal('user')}>
          {status === 'loaded' && imageUrl && (
            <Image
              style={[styles.image, imageStyle]}
              source={{
                uri: imageUrl,
              }}
              resizeMode="cover"
              onError={() => setStatus('error')}
            />
          )}
        </Pressable>
      )}
      {modal === 'user' && (
        <UserModal user={user} onCancel={() => setModal(undefined)} />
      )}
    </View>
  );
};

export default UserProfileImage;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: defaultBlack.lv4(1),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  image: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    height: 50,
    width: 50,
    borderRadius: 20,
  },
});
