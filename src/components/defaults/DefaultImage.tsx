import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {defaultBlack} from './DefaultColors';
import DefaultIcon from './DefaultIcon';

import DefaultText from './DefaultText';

export const getThumnailPath = (url: string) => url + '_200x200';

export type Props = {
  image?: string;
  type?: string;
  style?: TStyleView;
  imageStyle: {height: number; width: number};
  blurRadius?: number;
  showThumbnail?: boolean;
  onLoaded?: () => void;
  onPress?: () => void;
};

const DefaultImage = ({
  image,
  style,
  showThumbnail,
  imageStyle,
  blurRadius,
  onLoaded,
  onPress,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    let isMounted = true;
    const loadImageUrl = async () => {
      if (!image?.startsWith('file') && !image?.startsWith('http')) {
        setStatus('loading');
        try {
          if (showThumbnail && image) {
            try {
              const thumbnailPath = getThumnailPath(image);
              const storageRef = storage().ref(thumbnailPath);
              const downloadUrl = await storageRef.getDownloadURL();

              isMounted && setImageUrl(downloadUrl);
            } catch (error) {
              const storageRef = storage().ref(image);
              const downloadUrl = await storageRef.getDownloadURL();

              isMounted && setImageUrl(downloadUrl);
            }
          } else {
            const storageRef = storage().ref(image);

            const downloadUrl = await storageRef.getDownloadURL();

            isMounted && setImageUrl(downloadUrl);
          }
        } catch {
          isMounted && setStatus('error');
        } finally {
          isMounted && setStatus('loaded');
        }
      } else {
        isMounted && setImageUrl(image);
        isMounted && setStatus('loaded');
      }
    };

    if (image) {
      loadImageUrl();
    } else {
      isMounted && setStatus('loaded');
    }
    return () => {
      isMounted = false;
    };
  }, [image, showThumbnail]);

  return (
    <Pressable style={style} onPress={onPress} disabled={!onPress}>
      {status === 'loaded' && image && (
        <Image
          style={[styles.image, imageStyle]}
          source={{
            uri: imageUrl,
            cache: 'force-cache',
          }}
          resizeMode="cover"
          onLoadEnd={onLoaded}
          onError={() => setStatus('error')}
          blurRadius={blurRadius}
        />
      )}
      {status === 'loaded' && !image && (
        <DefaultText
          title="No image found"
          style={[styles.image, imageStyle]}
        />
      )}
      {status === 'loading' && (
        <View style={[styles.image, imageStyle, styles.loading]} />
      )}
      {status === 'error' && (
        <DefaultIcon
          icon="exclamation"
          style={[styles.image, imageStyle, styles.loading]}
        />
      )}
    </Pressable>
  );
};

export default DefaultImage;

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  loading: {backgroundColor: defaultBlack.lv3(1)},
});
