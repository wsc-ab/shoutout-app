import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {getMoment} from '../../functions/Moment';

import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {getTimeSinceTimestamp} from '../../utils/Date';
import LikeButton from '../buttons/LikeButton';
import NextButton from '../buttons/NextButton';
import ReplyButton from '../buttons/ReplyButton';
import ReportButton from '../buttons/ReportButton';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  moment: TDocData;
  style?: TStyleView;
  momentStyle?: {height: number; width: number};
  modalVisible?: boolean;
  initPaused?: boolean;
  showNav: boolean;
  onNext?: () => void;
  disabled?: boolean;
};

const MomentCard = ({
  moment,
  style,
  momentStyle = {height: 400, width: 300},
  modalVisible,
  initPaused,
  disabled,
  onNext,
  showNav,
}: TProps) => {
  const [data, setData] = useState(moment);

  const [ids] = useState<string[]>([moment.id, ...moment.linkFrom.ids]);
  const [index, setIndex] = useState<number>(0);
  const [status, setStatus] = useState<TStatus>('loaded');

  console.log(moment.linkFrom, 'ids');

  useEffect(() => {
    setData(moment);
  }, [moment]);

  const onNextLink = async () => {
    setIndex(pre => {
      if (index === ids.length - 1) {
        return 0;
      } else {
        return pre + 1;
      }
    });
    setStatus('loading');
  };

  useEffect(() => {
    const load = async () => {
      if (index !== undefined) {
        setStatus('loading');
        const {moment: linkedmoment} = await getMoment({
          moment: {id: ids[index]},
        });

        setStatus('loaded');

        setData(linkedmoment);
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [data.link, ids, index, status]);

  const onPreLink = () => {
    setIndex(pre => {
      if (index === 0) {
        return ids.length - 1;
      } else {
        return pre - 1;
      }
    });
    setStatus('loading');
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <View style={style}>
      <View style={styles.top}>
        {showNav && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <DefaultIcon
              icon={'arrow-left'}
              onPress={ids.length >= 2 ? onPreLink : undefined}
              color={ids.length >= 2 ? 'white' : 'gray'}
              style={{
                flex: 1,
                paddingHorizontal: 10,
                alignItems: 'center',
              }}
            />
            <DefaultText
              title={`${index + 1}/${ids.length}`}
              style={{flex: 1, alignItems: 'center'}}
            />
            <ReplyButton
              linkIds={ids.slice(1)}
              id={ids[0]}
              style={{flex: 1, alignItems: 'center'}}
            />
            <DefaultIcon
              icon={'arrow-right'}
              onPress={ids.length >= 2 ? onNextLink : undefined}
              color={ids.length >= 2 ? 'white' : 'gray'}
              style={{
                flex: 1,
                paddingHorizontal: 10,
                alignItems: 'center',
              }}
            />
          </View>
        )}
      </View>
      <View>
        <DefaultVideo
          path={data.path}
          style={{...momentStyle, borderRadius: 10}}
          modalVisible={!!modalVisible}
          initPaused={initPaused}
          disabled={disabled}
        />
      </View>
      {showNav && (
        <View style={styles.nav}>
          <View>
            <DefaultText title={data.contributeFrom?.items[0].name} />
            <DefaultText title={getTimeSinceTimestamp(data.createdAt)} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {onNext && (
              <NextButton
                onSuccess={onNext}
                style={{flex: 1, alignItems: 'center'}}
              />
            )}

            <LikeButton
              id={ids[0]}
              style={{flex: 1, alignItems: 'center'}}
              collection="moments"
            />
            {onNext && (
              <ReportButton
                collection="moments"
                id={ids[0]}
                onSuccess={onNext}
                style={{flex: 1, alignItems: 'center'}}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default MomentCard;

const styles = StyleSheet.create({
  top: {
    top: 80,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    right: 0,
  },
  nav: {
    bottom: 40,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    right: 0,
  },
});
