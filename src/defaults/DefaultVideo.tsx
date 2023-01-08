import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Video from 'react-native-video';

type TProps = {
  path: string;
};

const DefaultVideo = ({path}: TProps) => {
  const [uri, setUri] = useState<string>();
  const [paused, setPaused] = useState(false);

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
    <Pressable onPress={() => setPaused(pre => !pre)}>
      <Video
        source={{uri}} // Can be a URL or a local file.
        style={{width: 300, height: 300, borderWidth: 1, flex: 1}}
        paused={paused}
      />
    </Pressable>
  );
};

export default DefaultVideo;

const styles = StyleSheet.create({});