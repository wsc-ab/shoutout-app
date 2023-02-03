import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import Video from 'react-native-video';

import {TStyleView} from '../../types/Style';
import {getThumbnailPath} from '../../utils/Storage';
import DefaultImage from './DefaultImage';

type TProps = {
  path: string;
  style?: TStyleView;
  videoStyle: {width: number; height: number};
  play?: boolean;
  onLoaded?: () => void;
  onEnd?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  repeat?: boolean;
};

const DefaultVideo = React.memo(
  ({
    path,
    play,
    onEnd,
    repeat = false,
    onPress,
    style,
    disabled,
    onLoaded,
    videoStyle,
  }: TProps) => {
    const [uri, setUri] = useState<string>();
    const [thumbnailUri, setThumbnailUri] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
      setPaused(!play);
    }, [play]);

    useEffect(() => {
      const load = async () => {
        const thumbRef = storage().ref(getThumbnailPath(path, 'video'));

        const thumbUrl = await thumbRef.getDownloadURL();

        setThumbnailUri(thumbUrl);

        const videoRef = storage().ref(path);
        const videoUrl = await videoRef.getDownloadURL();
        setUri(videoUrl);
      };

      load();
    }, [path]);

    if (!uri) {
      return null;
    }

    return (
      <Pressable
        style={style}
        disabled={disabled}
        onPress={onPress ? onPress : () => setPaused(pre => !pre)}>
        {thumbnailUri && loading && (
          <DefaultImage image={thumbnailUri} imageStyle={videoStyle} />
        )}
        <Video
          source={{uri}}
          style={videoStyle}
          resizeMode="cover"
          paused={paused}
          onLoad={() => {
            setLoading(false);
            onLoaded && onLoaded();
          }}
          repeat={repeat}
          onEnd={onEnd}
        />
      </Pressable>
    );
  },
);

export default DefaultVideo;
