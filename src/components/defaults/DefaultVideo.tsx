import storage from '@react-native-firebase/storage';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import AuthUserContext from '../../contexts/AuthUser';

import {TStyleView} from '../../types/Style';
import {getThumbnailPath} from '../../utils/Storage';
import DefaultIcon from './DefaultIcon';
import DefaultImage from './DefaultImage';
import DefaultText from './DefaultText';

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
  const [buffer, setBuffer] = useState(true);
  const {reportedContents} = useContext(AuthUserContext);

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

  const isReported = reportedContents.includes(path);

  return (
    <Pressable
      style={style}
      disabled={disabled}
      onPress={onPress ? onPress : () => setPaused(pre => !pre)}>
      {isReported && (
        <View>
          <DefaultImage
            imageStyle={videoStyle}
            blurRadius={20}
            image={thumbnailUri}
          />
          <DefaultText
            title="Cancel report to view this moment"
            style={styles.reported}
          />
        </View>
      )}
      {!isReported && (
        <View style={videoStyle}>
          <Video
            source={{uri}}
            style={videoStyle}
            resizeMode="cover"
            posterResizeMode="cover"
            ignoreSilentSwitch="ignore"
            paused={paused}
            onLoad={() => {
              onLoaded && onLoaded();
            }}
            poster={thumbnailUri}
            onBuffer={({isBuffering}) => setBuffer(isBuffering)}
            repeat={repeat}
            onEnd={onEnd}
          />
          {paused && <DefaultIcon icon="play" style={styles.play} size={25} />}
          {!paused && buffer && (
            <ActivityIndicator style={styles.play} color="white" />
          )}
        </View>
      )}
    </Pressable>
  );
};

export default DefaultVideo;

const styles = StyleSheet.create({
  reported: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
