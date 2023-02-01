import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable} from 'react-native';
import Video from 'react-native-video';
import {TStyleView} from '../../types/Style';

type TProps = {
  path: string;
  style?: TStyleView;
  initPaused?: boolean;
  modalVisible: boolean;
  onLoaded?: () => void;
  disabled?: boolean;
};

const DefaultVideo = ({
  path,
  modalVisible,
  initPaused,
  disabled,
  style,
  onLoaded,
}: TProps) => {
  const [uri, setUri] = useState<string>();
  const [paused, setPaused] = useState(initPaused);
  const [loading, setLoading] = useState(true);

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
      onPress={() => setPaused(pre => !pre)}
      style={style}
      disabled={disabled}>
      {loading && <ActivityIndicator style={[style]} />}
      <Video
        source={{uri}} // Can be a URL or a local file.
        style={style}
        resizeMode="cover"
        paused={paused || modalVisible}
        onLoad={() => {
          setLoading(false);
          onLoaded && onLoaded();
        }}
        repeat
      />
    </Pressable>
  );
};

export default DefaultVideo;
