import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {loadFromCache} from '../../utils/Cache';

import {defaultBlack} from './DefaultColors';
import DefaultIcon from './DefaultIcon';

export const getThumnailPath = (url: string) => url + '_200x200';

export type Props = {
  user: {id: string};
  style?: TStyleView;
  imageStyle?: {height: number; width: number};
  onPress?: () => void;
};

const UserProfileImage = ({
  style,
  user: {id},
  imageStyle = {height: 50, width: 50},
  onPress,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string>();

  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    let isMounted = true;
    const loadImageUrl = async () => {
      const remoteThumbPath = `${id}/images/profileImage_200x200`;

      try {
        const localPath = await loadFromCache({remotePath: remoteThumbPath});

        setImageUrl(localPath);
      } catch (e) {
        setStatus('error');
      } finally {
        isMounted && setStatus('loaded');
      }
    };

    loadImageUrl();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!imageUrl || status === 'error') {
    return (
      <DefaultIcon
        icon="user"
        style={[styles.icon, imageStyle]}
        size={imageStyle.height / 3}
      />
    );
  }

  return (
    <Pressable style={style} onPress={onPress} disabled={!onPress}>
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
