import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {getContent} from '../../functions/Content';

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
  content: TDocData;
  style?: TStyleView;
  contentStyle?: {height: number; width: number};
  modalVisible?: boolean;
  initPaused?: boolean;
  showNav: boolean;
  onNext?: () => void;
};

const ContentCard = ({
  content,
  style,
  contentStyle = {height: 400, width: 300},
  modalVisible,
  initPaused,
  onNext,
  showNav,
}: TProps) => {
  const [data, setData] = useState(content);

  const [ids] = useState<string[]>([...content.id, ...content.links.ids]);
  const [index, setIndex] = useState<number>();
  const [status, setStatus] = useState<TStatus>('loaded');

  useEffect(() => {
    setData(content);
  }, [content]);

  const onNextLink = async () => {
    setIndex(pre => {
      if (pre === undefined) {
        return 0;
      } else if (index === data.links.ids.length - 1) {
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
        const {content: linkedContent} = await getContent({
          content: {id: ids[index]},
        });

        setStatus('loaded');

        setData(linkedContent);
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [data.link, ids, index, status]);

  return (
    <View style={style}>
      <View>
        {status === 'loaded' && (
          <DefaultVideo
            path={data.path}
            style={{...contentStyle, borderRadius: 10}}
            modalVisible={!!modalVisible}
            initPaused={initPaused}
          />
        )}
      </View>
      {showNav && (
        <View style={styles.nav}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <DefaultText
              title={data.contributeFrom?.items[0].name}
              style={{flex: 1, alignItems: 'center'}}
            />
            <DefaultText
              title={getTimeSinceTimestamp(data.createdAt)}
              style={{flex: 1, alignItems: 'center'}}
            />
            <DefaultIcon
              icon={'arrow-right'}
              onPress={data.links.ids.length >= 1 ? onNextLink : undefined}
              color={data.links.ids.length >= 1 ? 'white' : 'gray'}
              style={{
                flex: 1,
                paddingHorizontal: 10,
                alignItems: 'center',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <NextButton
              onSuccess={onNext}
              style={{flex: 1, alignItems: 'center'}}
            />
            <ReplyButton
              linkIds={ids.slice(1)}
              id={ids[0]}
              style={{flex: 1, alignItems: 'center'}}
            />
            <LikeButton
              id={ids[0]}
              style={{flex: 1, alignItems: 'center'}}
              collection="contents"
            />
            <ReportButton
              collection="contents"
              id={ids[0]}
              onSuccess={onNext}
              style={{flex: 1, alignItems: 'center'}}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  nav: {
    bottom: 40,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    right: 0,
  },
});
