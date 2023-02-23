import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TStatus} from '../../types/Screen';

import {TStyleView} from '../../types/Style';
import {loadFromCache} from '../../utils/Cache';

import {getThumbnailPath} from '../../utils/Storage';
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
  const [thumbPath, setThumbPath] = useState<string>();
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
        const newThumbPath = await loadFromCache({
          remotePath: getThumbnailPath(path, 'video'),
        });

        setThumbPath(newThumbPath);
      } catch (error) {}
      try {
        const videoPath = await loadFromCache({
          remotePath: path,
        });

        setUri(videoPath);
        setStatus('loaded');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [path, status]);

  const isReported = reportedContents.includes(path);

  const paused = !inView || userPaused;

  if (isReported) {
    return (
      <View>
        <DefaultImage
          imageStyle={videoStyle}
          blurRadius={20}
          image={getThumbnailPath(path, 'video')}
        />
        <DefaultText
          title="Cancel report to view this moment"
          style={styles.reported}
        />
      </View>
    );
  }

  if (!uri && thumbPath) {
    return (
      <View>
        <DefaultImage
          imageStyle={videoStyle}
          image={getThumbnailPath(path, 'video')}
        />
      </View>
    );
  }

  if (!uri) {
    return null;
  }

  return (
    <Pressable
      style={style}
      disabled={disabled}
      onPress={onPress ? onPress : () => setUserPaused(pre => !pre)}>
      {status === 'error' && (
        <Pressable style={styles.error} onPress={() => setStatus('loading')}>
          <DefaultIcon icon="exclamation" />
          <DefaultText title="Reload" />
        </Pressable>
      )}
      {mount && (
        <View style={videoStyle}>
          <Video
            source={{uri}}
            style={videoStyle}
            resizeMode="cover"
            posterResizeMode="cover"
            ignoreSilentSwitch="ignore"
            paused={paused}
            onError={() => {
              if (uri) {
                setStatus('error');
              }
            }}
            onLoad={() => {
              onLoaded && onLoaded();
            }}
            bufferConfig={{
              minBufferMs: 0,
              maxBufferMs: 0,
              bufferForPlaybackMs: 0,
              bufferForPlaybackAfterRebufferMs: 0,
            }}
            poster={thumbPath}
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
  error: {
    position: 'absolute',
    zIndex: 200,
    alignItems: 'center',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    right: 0,
  },
});
