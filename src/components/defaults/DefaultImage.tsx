import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {TStatus} from '../../types/Screen';
import {TStyleImage, TStyleView} from '../../types/Style';

import DefaultText from './DefaultText';

export const getThumnailPath = (url: string) => url + '_200x200';

export type Props = {
  image?: string;
  type?: string;
  style?: TStyleView;
  imageStyle: {height: number; width: number};
  showThumbnail?: boolean;
  onLoaded?: () => void;
  onPress?: () => void;
};

const DefaultImage = ({
  image,
  style,
  showThumbnail,
  imageStyle,
  onLoaded,
  onPress,
}: Props) => {
  let design: TStyleImage = {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    ...imageStyle,
  };

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

  console.log(imageUrl);

  return (
    <Pressable style={style} onPress={onPress} disabled={!onPress}>
      {status === 'loaded' && image && (
        <Image
          style={styles.image}
          source={{
            uri: imageUrl,
            cache: 'force-cache',
          }}
          onLoadEnd={onLoaded}
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
    </Pressable>
  );
};

export default DefaultImage;
