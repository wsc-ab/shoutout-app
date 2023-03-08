import React, {useContext, useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {loadFromCache} from '../../utils/Cache';

import {defaultBlack} from './DefaultColors';
import DefaultIcon from './DefaultIcon';

import DefaultText from './DefaultText';

export const getThumnailPath = (url: string) => url + '_200x200';

export type Props = {
  moment?: {id: string};
  image?: string;
  type?: string;
  style?: TStyleView;
  imageStyle: {height: number; width: number};
  onLoaded?: () => void;
  onPress?: () => void;
};

const DefaultImage = ({
  moment,
  image,
  style,
  imageStyle,
  onLoaded,
  onPress,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [status, setStatus] = useState<TStatus>('loading');
  const {reportedContents} = useContext(AuthUserContext);
  const isReported = moment ? reportedContents.includes(moment.id) : false;
  useEffect(() => {
    let isMounted = true;
    const loadImageUrl = async () => {
      if (!image) {
        isMounted && setStatus('loaded');
        return;
      }
      if (image.startsWith('file') || image.startsWith('http')) {
        isMounted && setImageUrl(image);
        isMounted && setStatus('loaded');
      }

      try {
        const localPath = await loadFromCache({remotePath: image});

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
  }, [image]);

  if (!image) {
    return null;
  }

  console.log(isReported, 'is');

  return (
    <Pressable style={style} onPress={onPress} disabled={!onPress}>
      {status === 'loaded' && image && (
        <Image
          style={[styles.image, imageStyle]}
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          onLoadEnd={onLoaded}
          onError={() => setStatus('error')}
          blurRadius={isReported ? 20 : undefined}
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
