import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {TStyleView} from '../../types/Style';

type TProps = {
  path: string;
  style?: TStyleView;
};

const DefaultVideo = ({path, style}: TProps) => {
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
    <Pressable onPress={() => setPaused(pre => !pre)} style={style}>
      <Video
        source={{uri}} // Can be a URL or a local file.
        style={styles.video}
        paused={paused}
        repeat
      />
    </Pressable>
  );
};

export default DefaultVideo;

const styles = StyleSheet.create({
  video: {width: 300, height: 300, flex: 1},
});
