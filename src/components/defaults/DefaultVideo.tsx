import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import Video from 'react-native-video';

import {TStyleView} from '../../types/Style';
import {getThumbnailPath} from '../../utils/Storage';

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

const DefaultVideo = ({
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
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    setPaused(!play);
  }, [play]);

  useEffect(() => {
    const load = async () => {
      try {
        const thumbRef = storage().ref(getThumbnailPath(path, 'video'));

        const thumbUrl = await thumbRef.getDownloadURL();

        setThumbnailUri(thumbUrl);
      } catch {}

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
      <Video
        source={{uri}}
        style={videoStyle}
        resizeMode="cover"
        posterResizeMode="cover"
        paused={paused}
        onLoad={() => {
          onLoaded && onLoaded();
        }}
        poster={thumbnailUri}
        repeat={repeat}
        onEnd={onEnd}
      />
    </Pressable>
  );
};

export default DefaultVideo;
