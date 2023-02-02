import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

import {TStyleView} from '../../types/Style';

type TProps = {
  path: string;
  style?: TStyleView;
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
  }: TProps) => {
    const [uri, setUri] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
      setPaused(!play);
    }, [play]);

    useEffect(() => {
      const load = async () => {
        const storageRef = storage().ref(path);
        const downloadUrl = await storageRef.getDownloadURL();

        setUri(downloadUrl);
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
        {loading && <View style={[styles.empty, style]} />}
        <Video
          source={{uri}}
          style={style}
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

const styles = StyleSheet.create({empty: {backgroundColor: 'gray'}});
