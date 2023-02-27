import React from 'react';
import {Pressable, View} from 'react-native';
import Video from 'react-native-video';

import {TStyleView} from '../../types/Style';

type TProps = {
  path: string;
  style?: TStyleView;
  videoStyle: {width: number; height: number};
};

const DefaultLocalVideo = ({path, style, videoStyle}: TProps) => {
  return (
    <Pressable style={style} disabled={true}>
      <View style={videoStyle}>
        <Video
          source={{uri: path}}
          style={videoStyle}
          resizeMode="cover"
          posterResizeMode="cover"
          ignoreSilentSwitch="ignore"
          paused={true}
          bufferConfig={{
            minBufferMs: 0,
            maxBufferMs: 0,
            bufferForPlaybackMs: 0,
            bufferForPlaybackAfterRebufferMs: 0,
          }}
          repeat={false}
        />
      </View>
    </Pressable>
  );
};

export default DefaultLocalVideo;
