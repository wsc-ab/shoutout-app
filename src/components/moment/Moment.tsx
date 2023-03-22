import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import ModalContext from '../../contexts/Modal';

import {TDocData, TDocSnapshot, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultImage from '../defaults/DefaultImage';

import DefaultVideo from '../defaults/DefaultVideo';
import MomentFooter from './MomentFooter';

type TProps = {
  moment: TDocData;
  channel: TDocData;
  style?: TStyleView;
  length: number;
  index: number;
  mount: boolean;
  inView: boolean;
  firstUploadDate: TTimestamp;
};

const Moment = ({
  moment,
  mount,
  index,
  inView,
  channel,
  length,
  firstUploadDate,
}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {onUpdate} = useContext(ModalContext);

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        DefaultAlert({title: 'Deleted Moment'});
        onUpdate();
        return;
      }

      const newData = doc.data();
      setData(newData);
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to get channel data',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('moments')
      .doc(moment.id)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [moment.id, onUpdate]);

  if (!data) {
    return null;
  }

  return (
    <View style={{height, width}}>
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
          repeat
          inView={inView}
        />
      )}

      <MomentFooter
        moment={data}
        channel={channel}
        index={index}
        length={length}
        firstUploadDate={firstUploadDate}
      />
    </View>
  );
};

export default Moment;
