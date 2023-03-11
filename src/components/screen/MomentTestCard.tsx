import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {getTimeGap} from '../../utils/Date';
import {getCityAndCountry} from '../../utils/Map';
import {defaultBlack, defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

import DefaultVideo from '../defaults/DefaultVideo';
import UserProfileImage from '../images/UserProfileImage';
import Footer from './Footer';

type TProps = {
  moment: {
    id: string;
    name: string;
    content: {path: string};
    createdBy: {id: string; displayName: string};
  };
  style?: TStyleView;
  length: number;
  index: number;
  mount: boolean;
  pauseOnModal?: boolean;
  inView: boolean;
  blur?: boolean;
  channel?: {id: string};
};

const MomentTestCard = ({
  moment,
  style,
  pauseOnModal = true,
  mount,
  inView,
  blur,
  channel,
  length,
  index,
}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const [status, setStatus] = useState<TStatus>('loading');

  console.log(data, 'data');

  useEffect(() => {
    const load = async () => {
      const momentData = (
        await firestore().collection('moments').doc(moment.id).get()
      ).data();

      setData(momentData);
      setStatus('loaded');
    };

    if (status === 'loading') {
      load();
    }
  }, [moment.id, status]);

  if (!data) {
    return null;
  }

  return (
    <View style={style}>
      <View style={{height, width}}>
        <View
          style={{
            position: 'absolute',
            bottom: 70,
            zIndex: 100,
            left: 0,
            right: 0,
            marginHorizontal: 20,
            borderRadius: 10,
            padding: 10,
            backgroundColor: defaultBlack.lv3(0.5),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
            }}>
            <DefaultIcon
              icon={data.content.media === 'video' ? 'video' : 'image'}
            />
            {data.content.mode === 'camera' && (
              <DefaultText
                title={'Camera'}
                textStyle={{
                  fontWeight: 'bold',
                }}
                style={{
                  backgroundColor: defaultRed.lv1,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginLeft: 5,
                  alignSelf: 'flex-start',
                  paddingVertical: 3,
                  paddingHorizontal: 6,
                }}
              />
            )}
            <DefaultText
              title={`${index + 1} / ${length}`}
              style={{flex: 1, alignItems: 'flex-end'}}
              textStyle={{fontWeight: 'bold'}}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <UserProfileImage
              user={{
                id: data.createdBy.id,
              }}
            />
            <View style={{marginLeft: 5}}>
              <DefaultText
                title={data.createdBy.displayName}
                textStyle={{fontWeight: 'bold'}}
              />
              <DefaultText
                title={data.name}
                textStyle={{fontWeight: 'bold', fontSize: 20}}
              />
              <DefaultText
                title={getCityAndCountry(data.location.formatted)}
                textStyle={{fontSize: 14, color: 'lightgray'}}
                numberOfLines={3}
              />
              <DefaultText
                title={`${getTimeGap(data.createdAt ?? data.addedAt)} ago`}
                textStyle={{fontSize: 14, color: 'lightgray'}}
                numberOfLines={3}
              />
            </View>
          </View>
        </View>
        {data.content.media === 'image' && (
          <DefaultImage
            moment={{id: data.id}}
            image={data.content.path}
            imageStyle={{height, width}}
          />
        )}

        {data.content.media === 'video' && (
          <DefaultVideo
            moment={{id: data.id, content: {path: data.content.path}}}
            videoStyle={{height, width}}
            mount={mount}
            pauseOnModal={pauseOnModal}
            repeat
            inView={inView}
            blur={blur}
            channel={channel}
          />
        )}
      </View>
      {!blur && <Footer moment={data} style={{marginHorizontal: 10}} />}
    </View>
  );
};

export default MomentTestCard;
