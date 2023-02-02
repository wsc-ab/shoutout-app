import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {getMoment} from '../../functions/Moment';

import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {moment: TDocData; style?: TStyleView; onPress?: () => void};

const MomentSummaryCard = ({moment, style, onPress}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);
  const {width} = useWindowDimensions();

  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      const {moment: newMoment} = await getMoment({
        moment: {id: moment.id},
      });

      setData([newMoment, ...newMoment.linkFrom.items]);
      setStatus('loaded');
    };

    if (status === 'loading') {
      load();
    }
  }, [moment.id, status]);

  const videoWidth = width / 3;

  return (
    <View style={style}>
      <FlatList
        data={data}
        initialNumToRender={1}
        horizontal
        snapToInterval={videoWidth}
        snapToAlignment={'start'}
        decelerationRate="fast"
        renderItem={({item}) => {
          return (
            <Pressable onPress={onPress} disabled={!onPress}>
              <DefaultVideo
                path={item.path}
                style={[
                  {height: (videoWidth * 4) / 3, width: videoWidth},
                  styles.video,
                ]}
                onPress={undefined}
                disabled={true}
                play={false}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  alignItems: 'center',
                  width: 300,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DefaultIcon icon="heart" />
                  <DefaultText
                    title={item.likeFrom.number.toString()}
                    style={{marginLeft: 5}}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <DefaultIcon icon="reply" />
                  <DefaultText
                    title={item.linkFrom.number.toString()}
                    style={{marginLeft: 5}}
                  />
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default MomentSummaryCard;

const styles = StyleSheet.create({video: {borderRadius: 10}});
