import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {getContent} from '../../functions/Content';

import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
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
} & ({onNext: () => void; showNav: true} | {showNav: false; onNext: undefined});

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
  const [index, setIndex] = useState<number>();
  const [status, setStatus] = useState<TStatus>('loaded');

  const onNextLink = async () => {
    setIndex(pre => {
      if (pre === undefined) {
        return 0;
      } else if (index === data.link.ids.length - 1) {
        return undefined;
      } else {
        return pre + 1;
      }
    });
  };

  useEffect(() => {
    const load = async () => {
      if (index !== undefined) {
        setStatus('loading');
        const {content: linkedContent} = await getContent({
          content: {id: data.links[index]},
        });
        setStatus('loaded');

        setData(linkedContent);
      }
    };

    load();
  }, [data.links, index]);

  return (
    <View style={[styles.container, style]}>
      {status === 'loaded' && (
        <DefaultVideo
          path={data.path}
          style={[styles.content, contentStyle]}
          modalVisible={!!modalVisible}
          initPaused={initPaused}
        />
      )}
      <DefaultText title={data.contributeFrom.items[0].name} />
      {data.link.ids.length >= 1 && (
        <DefaultIcon icon={'arrow-right'} onPress={onNextLink} />
      )}
      {showNav && (
        <View style={styles.nav}>
          <NextButton onSuccess={onNext} style={{flex: 1}} id={content.id} />
          <LikeButton id={content.id} style={{flex: 1}} collection="contents" />
          <ReplyButton id={content.id} style={{flex: 1}} link={content.links} />
          <ReportButton
            collection="contents"
            id={content.id}
            onSuccess={onNext}
            style={{flex: 1}}
          />
        </View>
      )}
    </View>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  content: {borderRadius: 10},
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 40,
    paddingHorizontal: 20,
  },
});
