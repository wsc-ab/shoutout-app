import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import Video from 'react-native-video';
import {TStyleView} from '../../types/Style';

type TProps = {
  path: string;
  style?: TStyleView;
  initPaused?: boolean;
  modalVisible: boolean;
};

const DefaultVideo = ({path, modalVisible, initPaused, style}: TProps) => {
  const [uri, setUri] = useState<string>();
  const [paused, setPaused] = useState(initPaused);

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
    <Pressable onPress={() => setPaused(pre => !pre)} style={style}>
      <Video
        source={{uri}} // Can be a URL or a local file.
        style={style}
        resizeMode="cover"
        paused={paused || modalVisible}
        repeat
      />
    </Pressable>
  );
};

export default DefaultVideo;
