import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  View,
} from 'react-native';
import {TStatus} from '../../types/Screen1';

import DefaultText from './DefaultText';

export const getThumnailPath = (url: string) => url + '_200x200';

export type Props = {
  image?: string;
  type?: string;
  style?: ImageStyle;
};

const DefaultImage = ({image, type, style}: Props) => {
  let design: ImageStyle = {
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    alignItems: 'center',
  };

  let showThumbnail = false;

  if (type) {
    switch (type) {
      case 'extraSmall':
        design.width = 25;
        design.height = 25;
        showThumbnail = true;
        break;

      case 'small':
        design.width = 50;
        design.height = 50;
        showThumbnail = true;
        break;

      case 'medium':
        design.width = 70;
        design.height = 70;
        showThumbnail = true;
        break;

      case 'large':
        design.width = 150;
        design.height = 150;
        break;

      case 'extraLarge':
        design.width = 300;
        design.height = 300;
        break;
    }
  }

  const styles = StyleSheet.create({
    image: design,
  });

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
    <>
      {status === 'loaded' && image && (
        <Image
          style={[styles.image, style]}
          source={{
            uri: imageUrl,
            cache: 'force-cache',
          }}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'loaded' && !image && (
        <View style={[styles.image, style]}>
          <DefaultText title="No image" />
        </View>
      )}
      {status === 'loading' && (
        <View style={[styles.image, style]}>
          <ActivityIndicator />
        </View>
      )}
      {status === 'error' && (
        <View style={[styles.image, style]}>
          <DefaultText title="Error" />
        </View>
      )}
    </>
  );
};

export default DefaultImage;
