import React, {useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultLocalVideo from '../defaults/DefaultLocalVideo';

type TProps = {
  localPath: string;
  style?: TStyleView;
};

const tempPath =
  'file:///Users/wonsangchoi/Library/Developer/CoreSimulator/Devices/6D2B5938-C8B9-4947-80B3-BE1F7A689DED/data/Containers/Data/Application/1FC8C976-151B-41D9-BC7B-DECC93E871D1/tmp/IMG_1891.mov';

const UploadButton = ({localPath, style}: TProps) => {
  const [full, setFull] = useState(false);

  return (
    <View style={style}>
      <Pressable onPress={() => setFull(pre => !pre)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          {full && (
            <DefaultLocalVideo
              path={localPath}
              style={{marginRight: 10}}
              videoStyle={{
                width: 50,
                height: 50,
              }}
            />
          )}
          <ActivityIndicator color={'white'} />
        </View>
      </Pressable>
    </View>
  );
};

export default UploadButton;
