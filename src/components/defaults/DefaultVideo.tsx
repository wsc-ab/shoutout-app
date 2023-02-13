import storage from '@react-native-firebase/storage';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStatus} from '../../types/Screen';

import {TStyleView} from '../../types/Style';
import {getThumbnailPath, getVideoUrl} from '../../utils/Storage';
import DefaultIcon from './DefaultIcon';
import DefaultImage from './DefaultImage';
import DefaultText from './DefaultText';

type TProps = {
  path: string;
  style?: TStyleView;
  videoStyle: {width: number; height: number};
  onLoaded?: () => void;
  onEnd?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  repeat?: boolean;
  index: number;
  elIndex: number;
  mount: boolean;
  pauseOnModal?: boolean;
  inView: boolean;
};

const DefaultVideo = ({
  path,
  onEnd,
  repeat = false,
  onPress,
  style,
  disabled,
  onLoaded,
  mount,
  videoStyle,
  pauseOnModal = true,
  inView: parentInview,
}: TProps) => {
  const [uri, setUri] = useState<string>();
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(!parentInview);
  const [buffer, setBuffer] = useState(false);
  const {reportedContents} = useContext(AuthUserContext);
  const {modal} = useContext(ModalContext);
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    if (pauseOnModal) {
      setInView(modal ? false : parentInview);
    } else {
      setInView(parentInview);
    }
  }, [modal, pauseOnModal, parentInview]);

  useEffect(() => {
    const load = async () => {
      try {
        const thumbRef = storage().ref(getThumbnailPath(path, 'video'));

        const thumbUrl = await thumbRef.getDownloadURL();

        setThumbnailUri(thumbUrl);
      } catch {}

      try {
        const videoUrl = await getVideoUrl(path);
        setUri(videoUrl);
      } catch (error) {
        setStatus('error');
      }
    };

    load();
  }, [path]);

  if (!uri) {
    return null;
  }

  const isReported = reportedContents.includes(path);

  const paused = !inView || userPaused;

  return (
    <Pressable
      style={style}
      disabled={disabled}
      onPress={onPress ? onPress : () => setUserPaused(pre => !pre)}>
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
      {status === 'error' && (
        <DefaultIcon icon="exclamation" style={videoStyle} />
      )}
      {!isReported && mount && (
        <View style={videoStyle}>
          <Video
            source={{uri}}
            style={videoStyle}
            resizeMode="cover"
            posterResizeMode="cover"
            ignoreSilentSwitch="ignore"
            paused={paused}
            onLoadStart={() => console.log('load started for ', path)}
            onLoad={dat => {
              console.log(dat, 'load dat', path);
              onLoaded && onLoaded();
            }}
            bufferConfig={{
              minBufferMs: 0,
              maxBufferMs: 0,
              bufferForPlaybackMs: 0,
              bufferForPlaybackAfterRebufferMs: 0,
            }}
            poster={thumbnailUri}
            onBuffer={({isBuffering}) => setBuffer(isBuffering)}
            repeat={repeat}
            onEnd={onEnd}
          />
          {userPaused && (
            <DefaultIcon icon="play" style={styles.play} size={20} />
          )}
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
