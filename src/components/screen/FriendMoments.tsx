import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {getFriendMoments} from '../../functions/Moment';
import {TLocation, TObject, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import InviteCard from '../cards/InviteCard';
import SmallUserCard from '../cards/SmallUserCard';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import ContentCard from './ContentCard';

type TProps = {
  style: TStyleView;
};

const FriendMoments = ({style}: TProps) => {
  const [data, setData] = useState<TObject>([]);
  const [status, setStatus] = useState<TStatus>('loading');
  const {onUpdate} = useContext(ModalContext);

  const {width} = useWindowDimensions();
  const videoWidth = (width - 10) / 3;
  const videoHeight = (videoWidth * 4) / 3;

  useEffect(() => {
    const load = async () => {
      try {
        const {contents} = await getFriendMoments({});

        setData(contents);

        setStatus('loaded');
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });

        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  if (status === 'error') {
    return (
      <View style={styles.noData}>
        <DefaultText title="Error. Please retry." />
        <DefaultText
          title="Reload"
          onPress={() => setStatus('loading')}
          style={styles.refresh}
        />
      </View>
    );
  }

  return (
    <View style={[style, {top: 100}]}>
      <FlatList
        data={data}
        ListHeaderComponent={
          <InviteCard
            style={{marginBottom: 10, backgroundColor: defaultBlack.lv2(1)}}
          />
        }
        ListEmptyComponent={
          <DefaultText
            title="No moment found. Add more friends!"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        }
        contentContainerStyle={styles.container}
        keyExtractor={item => item.id + item.content.path}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => setStatus('loading')}
            tintColor={'gray'}
          />
        }
        renderItem={({
          item,
        }: {
          item: {
            id: string;
            content: {
              path: string;
              location?: TLocation;
              id: string;
              addedAt: TTimestamp;
              user: {id: string};
            };
            displayName: string;
            thumbnail?: string;
            addedAt: TTimestamp;
          };
        }) => {
          return (
            <View>
              <SmallUserCard
                id={item.id}
                displayName={item.displayName}
                thumbnail={item.thumbnail}
              />
              <ContentCard
                content={{...item.content, user: {id: item.id}}}
                onPress={() => {
                  onUpdate({target: 'moments', id: item.content.id});
                }}
                contentStyle={{
                  width: videoWidth,
                  height: videoHeight,
                }}
              />
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
    </View>
  );
};

export default FriendMoments;

const styles = StyleSheet.create({
  container: {paddingBottom: 150},
  seperator: {
    marginBottom: 20,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
