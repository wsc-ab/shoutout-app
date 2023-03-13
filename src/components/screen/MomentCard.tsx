import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import ModalContext from '../../contexts/Modal';

import {TDocData, TDocSnapshot} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultImage from '../defaults/DefaultImage';

import DefaultVideo from '../defaults/DefaultVideo';
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
  index,
  inView,
  blur,
  channel,
  length,
}: TProps) => {
  const {height, width} = useWindowDimensions();
  const [data, setData] = useState<TDocData>();
  const {onUpdate} = useContext(ModalContext);

  console.log(inView, moment.name, pauseOnModal, 'in');

  useEffect(() => {
    const onNext = async (doc: TDocSnapshot) => {
      if (!doc.exists) {
        DefaultAlert({title: 'Deleted Moment'});
        onUpdate();
        return;
      }

      const newData = doc.data();

      if (newData) {
        setData(newData);
      }
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
    <View style={style}>
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
            pauseOnModal={pauseOnModal}
            repeat
            inView={inView}
            blur={blur}
            channel={channel}
          />
        )}
      </View>
      {!blur && (
        <Footer
          moment={data}
          index={index}
          length={length}
          style={{marginHorizontal: 10}}
        />
      )}
    </View>
  );
};

export default MomentTestCard;
